"""openai-compatible chat-completions client. llm is the only paid api."""
from __future__ import annotations

from typing import AsyncIterator

import httpx


class LLMError(RuntimeError):
    pass


async def complete(
    messages: list[dict[str, str]],
    *,
    base_url: str,
    api_key: str,
    model: str,
    temperature: float = 0.3,
    max_tokens: int = 1500,
    timeout_s: float = 60.0,
) -> str:
    """single non-streaming completion → assistant text."""
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
                },
            )
    except httpx.HTTPError as exc:
        raise LLMError(f"llm transport error: {exc}") from exc
    if resp.status_code >= 400:
        raise LLMError(f"llm http {resp.status_code}: {resp.text[:300]}")
    try:
        data = resp.json()
        return str(data["choices"][0]["message"]["content"] or "")
    except (KeyError, IndexError, ValueError) as exc:
        raise LLMError(f"llm bad response: {resp.text[:300]}") from exc


async def complete_stream(
    messages: list[dict[str, str]],
    *,
    base_url: str,
    api_key: str,
    model: str,
    temperature: float = 0.3,
    max_tokens: int = 1500,
    timeout_s: float = 90.0,
) -> AsyncIterator[str]:
    """streaming completion → yields text deltas (sse `partial` upstream)."""
    if not api_key:
        raise LLMError("llm not configured (LLM_API_KEY missing)")
    url = base_url.rstrip("/") + "/chat/completions"
    try:
        async with httpx.AsyncClient(timeout=timeout_s) as client:
            async with client.stream(
                "POST",
                url,
                headers={
                    "authorization": f"Bearer {api_key}",
                    "content-type": "application/json",
                    "accept": "text/event-stream",
                },
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "stream": True,
                },
            ) as resp:
                if resp.status_code >= 400:
                    body = await resp.aread()
                    raise LLMError(f"llm http {resp.status_code}: {body[:300]!r}")
                async for line in resp.aiter_lines():
                    line = line.strip()
                    if not line.startswith("data:"):
                        continue
                    payload = line[5:].strip()
                    if payload == "[DONE]":
                        break
                    try:
                        import json as _json

                        chunk = _json.loads(payload)
                        delta = chunk["choices"][0]["delta"].get("content", "")
                    except (ValueError, KeyError, IndexError):
                        continue
                    if delta:
                        yield str(delta)
    except httpx.HTTPError as exc:
        raise LLMError(f"llm transport error: {exc}") from exc
