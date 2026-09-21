"""jina fast path — search + reader for small tasks. keyless works, key is faster."""
from __future__ import annotations

from dataclasses import dataclass

import httpx

from ..config import settings
from ..security import validate_url

UA = "ramya-agent/0.1 (+https://ramyaai.tech/chat; research beta)"
SEARCH_URL = "https://s.jina.ai/"
READER_URL = "https://r.jina.ai/"
TIMEOUT = 25.0


@dataclass
class JinaHit:
    title: str
    url: str
    snippet: str = ""


@dataclass
class JinaText:
    url: str
    title: str = ""
    text: str = ""
    error: str = ""

    @property
    def ok(self) -> bool:
        return not self.error


def _headers(extra: dict[str, str] | None = None) -> dict[str, str]:
    h = {"user-agent": UA, "accept": "application/json"}
    if settings.jina_api_key:
        h["authorization"] = f"Bearer {settings.jina_api_key}"
    if extra:
        h.update(extra)
    return h


def _clean(text: str, limit: int = 280) -> str:
    return " ".join((text or "").split())[:limit]


async def jina_search(query: str, limit: int = 5) -> tuple[list[JinaHit], str]:
    """GET s.jina.ai/<query> → hits. returns (hits, error)."""
    query = query.strip()[:300]
    if not query:
        return [], "empty query"
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.get(SEARCH_URL + query, headers=_headers())
    except httpx.HTTPError as exc:
        return [], f"jina search transport: {exc}"
    if resp.status_code == 402:
        return [], "jina credit exhausted (add JINA_API_KEY or wait)"
    if resp.status_code == 429:
        return [], "jina rate-limited — retry shortly"
    if resp.status_code >= 400:
        return [], f"jina search http {resp.status_code}"
    hits: list[JinaHit] = []
    try:
        data = resp.json()
        items = data.get("data", data if isinstance(data, list) else [])
        if isinstance(items, dict):
            items = items.get("results", [])
        for item in items[:limit]:
            if not isinstance(item, dict):
                continue
            url = str(item.get("url") or "").strip()
            if not url.startswith("http"):
                continue
            ok, _ = validate_url(url)
            if not ok:
                continue
            hits.append(
                JinaHit(
                    title=_clean(str(item.get("title") or url), 160),
                    url=url,
                    snippet=_clean(str(item.get("content") or item.get("description") or "")),
                )
            )
    except ValueError:
        # plain-text fallback — extract urls line by line
        import re as _re

        for url in _re.findall(r"https?://[^\s)>\]]+", resp.text)[:limit]:
            ok, _ = validate_url(url)
            if ok:
                hits.append(JinaHit(title=url, url=url))
    return hits, ""


async def jina_read(url: str, max_chars: int = 12000) -> JinaText:
    """GET r.jina.ai/<url> → markdown-ish text. fast path for small pages."""
    ok, reason = validate_url(url)
    if not ok:
        return JinaText(url=url, error=reason)
    target = url if url.startswith(("http://", "https://")) else "https://" + url
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.get(
                READER_URL + target,
                headers=_headers({"x-return-format": "markdown", "x-timeout": "20"}),
            )
    except httpx.HTTPError as exc:
        return JinaText(url=url, error=f"jina reader transport: {exc}")
    if resp.status_code == 402:
        return JinaText(url=url, error="jina credit exhausted")
    if resp.status_code == 429:
        return JinaText(url=url, error="jina rate-limited — retry shortly")
    if resp.status_code >= 400:
        return JinaText(url=url, error=f"jina reader http {resp.status_code}")
    try:
        data = resp.json()
        payload = data.get("data", data) if isinstance(data, dict) else {}
        text = str(payload.get("content") or payload.get("text") or "")
        title = str(payload.get("title") or "")
    except ValueError:
        text, title = resp.text, ""
    text = " ".join(text.split()).strip()[:max_chars]
    if len(text) < 100:
        return JinaText(url=url, error="no readable text via jina")
    return JinaText(url=url, title=title[:200], text=text)
