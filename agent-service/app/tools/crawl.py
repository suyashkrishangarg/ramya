"""custom webcrawl — scrapling extraction (static first, browser opt-in).

guards (unchanged): validate → robots → size cap → extract. jina reader is
available as the quick path for small pages via depth="quick".
"""
from __future__ import annotations

import urllib.robotparser as robotparser
from dataclasses import dataclass
from functools import lru_cache
from urllib.parse import urlparse

import httpx

from ..security import validate_url

UA = "ramya-agent/0.1 (+https://ramyaai.tech/chat; research beta)"
CRAWL_TIMEOUT = 20.0
MAX_BYTES = 1_500_000  # 1.5mb head-check cap before handing to scrapling


@dataclass
class CrawlOutcome:
    url: str
    title: str = ""
    text: str = ""
    via: str = "static"  # static | browser | jina | bs4-fallback
    error: str = ""

    @property
    def ok(self) -> bool:
        return not self.error


@lru_cache(maxsize=256)
def _robots_allows(url: str, ua_prefix: str = "ramya-agent") -> bool:
    """best-effort robots check, cached per origin. fail-open on errors."""
    try:
        parts = urlparse(url)
        robots_url = f"{parts.scheme}://{parts.netloc}/robots.txt"
        rp = robotparser.RobotFileParser()
        rp.set_url(robots_url)
        rp.read()
        return bool(rp.can_fetch(ua_prefix, url))
    except Exception:
        return True


async def webcrawl(url: str, *, depth: str = "full", mandatory: bool = False) -> CrawlOutcome:
    """crawl one page.

    guards: validate → robots → head-check (size/type/redirect) → extract.
    depth quick → jina reader (fast, small pages). depth full or any
    user-supplied (mandatory) url → always scrapling static→browser path.
    """
    from . import extract as _extract
    from . import jina as _jina

    ok, reason = validate_url(url)
    if not ok:
        return CrawlOutcome(url=url, error=reason)
    if not _robots_allows(url):
        return CrawlOutcome(url=url, error="blocked by robots.txt")

    use_jina = depth == "quick" and not mandatory
    if use_jina:
        out = await _jina.jina_read(url)
        if out.ok:
            return CrawlOutcome(url=url, title=out.title, text=out.text, via="jina")
        # fall through to scrapling on jina failure

    head_err = await _head_check(url)
    if head_err:
        return CrawlOutcome(url=url, error=head_err)
    out = await _extract.extract(url)
    if not out.ok:
        # emergency bs4 fallback (kept until scrapling proves out in prod)
        fb = await _bs4_fallback(url)
        if fb.ok:
            return fb
        return CrawlOutcome(url=url, error=out.error)
    return CrawlOutcome(url=url, title=out.title, text=out.text, via=out.via)


async def _head_check(url: str) -> str:
    """lightweight pre-flight: type + size + redirect re-validation."""
    try:
        async with httpx.AsyncClient(
            timeout=CRAWL_TIMEOUT, follow_redirects=True, max_redirects=3
        ) as client:
            async with client.stream("GET", url, headers={"user-agent": UA}) as resp:
                if resp.status_code >= 400:
                    return f"http {resp.status_code}"
                ctype = resp.headers.get("content-type", "")
                if "html" not in ctype and "text" not in ctype:
                    return f"skipped {ctype or 'unknown type'}"
                final = str(resp.url)
                ok_final, reason_final = validate_url(final)
                if not ok_final:
                    return f"redirect: {reason_final}"
                try:
                    length = int(resp.headers.get("content-length", "0") or 0)
                except ValueError:
                    length = 0
                if length > MAX_BYTES * 4:
                    return "page too large"
    except httpx.HTTPError as exc:
        return f"fetch failed: {exc}"
    return ""


async def _bs4_fallback(url: str) -> CrawlOutcome:
    """emergency fallback — plain httpx + bs4 strip. remove once scrapling is proven."""
    from bs4 import BeautifulSoup

    try:
        async with httpx.AsyncClient(
            timeout=CRAWL_TIMEOUT, follow_redirects=True, max_redirects=3
        ) as client:
            resp = await client.get(url, headers={"user-agent": UA})
            if resp.status_code >= 400:
                return CrawlOutcome(url=url, error=f"http {resp.status_code}")
            html = resp.text[:MAX_BYTES]
    except httpx.HTTPError as exc:
        return CrawlOutcome(url=url, error=f"fetch failed: {exc}")
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "nav", "header", "footer", "aside", "form"]):
        tag.decompose()
    title = soup.title.string.strip() if soup.title and soup.title.string else ""
    text = " ".join(soup.get_text(separator=" ").split()).strip()[:12000]
    if len(text) < 100:
        return CrawlOutcome(url=url, error="no readable text")
    return CrawlOutcome(url=url, title=title[:200], text=text, via="bs4-fallback")
