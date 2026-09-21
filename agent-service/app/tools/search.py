"""custom websearch — no paid search api. ddg html + wikipedia + arxiv."""
from __future__ import annotations

from dataclasses import dataclass, field

import httpx
from bs4 import BeautifulSoup

from ..security import validate_url

UA = "ramya-agent/0.1 (+https://ramyaai.tech/chat; research beta)"
SEARCH_TIMEOUT = 15.0


@dataclass
class SearchHit:
    title: str
    url: str
    snippet: str = ""
    origin: str = "ddg"


@dataclass
class SearchOutcome:
    query: str
    hits: list[SearchHit] = field(default_factory=list)
    error: str = ""


def _clean(text: str, limit: int = 280) -> str:
    return " ".join((text or "").split())[:limit]


async def _ddg_search(client: httpx.AsyncClient, query: str, limit: int) -> list[SearchHit]:
    """duckduckgo html endpoint — plain html, no key, parse result anchors."""
    hits: list[SearchHit] = []
    try:
        resp = await client.post(
            "https://html.duckduckgo.com/html/",
            data={"q": query},
            headers={"user-agent": UA},
        )
        if resp.status_code != 200:
            return hits
        soup = BeautifulSoup(resp.text, "html.parser")
        for anchor in soup.select("a.result__a"):
            href = (anchor.get("href") or "").strip()
            if not href.startswith("http"):
                continue
            ok, _ = validate_url(href)
            if not ok:
                continue
            title = _clean(anchor.get_text(), 160)
            snippet = ""
            parent = anchor.find_parent("div", class_="result")
            if parent is not None:
                snip = parent.select_one(".result__snippet")
                if snip is not None:
                    snippet = _clean(snip.get_text())
            if title and href:
                hits.append(SearchHit(title=title, url=href, snippet=snippet, origin="ddg"))
            if len(hits) >= limit:
                break
    except httpx.HTTPError:
        pass
    return hits


async def _wikipedia_search(client: httpx.AsyncClient, query: str) -> list[SearchHit]:
    """wikipedia opensearch — instant facts/entities, very reliable."""
    hits: list[SearchHit] = []
    try:
        resp = await client.get(
            "https://en.wikipedia.org/w/api.php",
            params={"action": "opensearch", "search": query, "limit": 3, "format": "json"},
            headers={"user-agent": UA},
        )
        if resp.status_code != 200:
            return hits
        data = resp.json()
        titles = data[1] if len(data) > 1 else []
        descs = data[2] if len(data) > 2 else []
        links = data[3] if len(data) > 3 else []
        for i, link in enumerate(links):
            if not isinstance(link, str) or not link.startswith("http"):
                continue
            title = str(titles[i]) if i < len(titles) else link
            snippet = str(descs[i]) if i < len(descs) else ""
            hits.append(
                SearchHit(title=_clean(title, 160), url=link, snippet=_clean(snippet), origin="wikipedia")
            )
    except (httpx.HTTPError, ValueError, IndexError):
        pass
    return hits


async def _arxiv_search(client: httpx.AsyncClient, query: str) -> list[SearchHit]:
    """arxiv api — papers for research-y queries. cheap xml parse."""
    hits: list[SearchHit] = []
    try:
        resp = await client.get(
            "https://export.arxiv.org/api/query",
            params={"search_query": f"all:{query}", "start": 0, "max_results": 3},
            headers={"user-agent": UA},
        )
        if resp.status_code != 200:
            return hits
        soup = BeautifulSoup(resp.text, "xml")
        for entry in soup.find_all("entry")[:3]:
            link_tag = entry.find("id")
            title_tag = entry.find("title")
            summary_tag = entry.find("summary")
            link = link_tag.get_text(strip=True) if link_tag else ""
            if not link.startswith("http"):
                continue
            ok, _ = validate_url(link)
            if not ok:
                continue
            hits.append(
                SearchHit(
                    title=_clean(title_tag.get_text() if title_tag else link, 160),
                    url=link,
                    snippet=_clean(summary_tag.get_text() if summary_tag else ""),
                    origin="arxiv",
                )
            )
    except httpx.HTTPError:
        pass
    return hits


async def websearch(query: str, limit: int = 6, *, mode: str = "deep") -> SearchOutcome:
    """route: quick → jina search (fast); deep → ddg + wikipedia + arxiv fan-out.

    jina failures fall back to the custom fan-out so one provider never
    kills the loop. dedupe by url, keep order.
    """
    from . import jina as _jina

    query = query.strip()[:300]
    if not query:
        return SearchOutcome(query=query, error="empty query")
    if mode == "quick":
        hits, err = await _jina.jina_search(query, limit=limit)
        if hits:
            return SearchOutcome(
                query=query,
                hits=[SearchHit(title=h.title, url=h.url, snippet=h.snippet, origin="jina") for h in hits],
            )
        # fall through to custom fan-out on jina failure/empty
    try:
        async with httpx.AsyncClient(timeout=SEARCH_TIMEOUT, follow_redirects=False) as client:
            ddg, wiki, arxiv = await _gather(client, query)
    except Exception as exc:  # never let search kill the loop
        return SearchOutcome(query=query, error=f"search failed: {exc}")
    seen: set[str] = set()
    merged: list[SearchHit] = []
    for hit in [*wiki, *ddg, *arxiv]:
        if hit.url in seen:
            continue
        seen.add(hit.url)
        merged.append(hit)
        if len(merged) >= limit:
            break
    if not merged and mode == "quick":
        return SearchOutcome(query=query, error="no results")
    return SearchOutcome(query=query, hits=merged)


async def _gather(
    client: httpx.AsyncClient, query: str
) -> tuple[list[SearchHit], list[SearchHit], list[SearchHit]]:
    import asyncio

    ddg, wiki, arxiv = await asyncio.gather(
        _ddg_search(client, query, 6),
        _wikipedia_search(client, query),
        _arxiv_search(client, query),
    )
    return ddg, wiki, arxiv
