async def complete_with_tools(
    messages: list[dict[str, str]],
    tools: list[dict],
    *,
    base_url: str,
    api_key: str,
    model: str,
    temperature: float = 0.3,
    max_tokens: int = 800,
    timeout_s: float = 60.0,
) -> dict:
    """one decide step → parsed tool call {name, args} (never raises on shape).

    tries native `tool_calls` first, falls back to a json-blob parse for
    models (e.g. deepseek via nim) with weak function-calling fidelity.
    returns {"name": "finish", "args": {}} when nothing parseable comes back,
    so the loop always terminates instead of hanging.
    """
    raw = ""
    tool_calls: list[dict] = []
    if not api_key:
        raise LLMError("llm not configured (LLM_API_KEY missing)")
    url = base_url.rstrip("/") + "/chat/completions"
    try:
        async with httpx.AsyncClient(timeout=timeout_s) as client:
            resp = await client.post(
                url,
                headers={
                    "authorization": f"Bearer {api_key}",
                    "content-type": "application/json",
                },
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "tools": tools,
                    "tool_choice": "required",
                },
            )
    except httpx.HTTPError as exc:
        raise LLMError(f"llm transport error: {exc}") from exc
    if resp.status_code >= 400:
        raise LLMError(f"llm http {resp.status_code}: {resp.text[:300]}")
    try:
        data = resp.json()
        msg = data["choices"][0]["message"]
        raw = str(msg.get("content") or "")
        tool_calls = list(msg.get("tool_calls") or [])
    except (KeyError, IndexError, ValueError) as exc:
        raise LLMError(f"llm bad response: {resp.text[:300]}") from exc
    for call in tool_calls:
        try:
            fn = call.get("function", {})
            name = str(fn.get("name") or "")
            args = fn.get("arguments", {})
            if isinstance(args, str):
                import json as _json

                args = _json.loads(args) if args.strip() else {}
            if name and isinstance(args, dict):
                return {"name": name, "args": args}
        except (ValueError, AttributeError):
            continue
    # tolerant fallback — json blob {"tool": ..., "args": {...}} in content
    parsed = parse_tool_blob(raw)
    if parsed is not None:
        return parsed
    return {"name": "finish", "args": {}}


def parse_tool_blob(raw: str) -> dict | None:
    """parse {"tool": name, "args": {...}} from free text. none when absent."""
    import json as _json
    import re as _re

    if not raw or not raw.strip():
        return None
    text = raw.strip()

    def _try(cand: str) -> dict | None:
        try:
            obj = _json.loads(cand)
        except ValueError:
            return None
        if isinstance(obj, dict) and isinstance(obj.get("tool"), str):
            args = obj.get("args", {})
            if isinstance(args, dict):
                return {"name": obj["tool"], "args": args}
        return None

    # 1 · balanced-brace scan for an object containing "tool"
    for start in [m.start() for m in _re.finditer(r"\{", text)]:
        depth, in_str, esc = 0, False, False
        for i in range(start, len(text)):
            ch = text[i]
            if in_str:
                if esc:
                    esc = False
                elif ch == "\\":
                    esc = True
                elif ch == '"':
                    in_str = False
                continue
            if ch == '"':
                in_str = True
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    if '"tool"' in text[start : i + 1]:
                        hit = _try(text[start : i + 1])
                        if hit is not None:
                            return hit
                    break
    # 2 · whole content (may itself be the blob)
    if text.startswith("{"):
        hit = _try(text)
        if hit is not None:
            return hit
    return None
