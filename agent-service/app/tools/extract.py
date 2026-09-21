"""scrapling extraction — static first, browser escalation opt-in.

Fetcher (static) handles most pages fast. when it returns thin/empty text
and SCRAPL_ALLOW_BROWSER=1, escalate to DynamicFetcher (chromium) for
js-rendered pages. browser pages are capped separately (SCRAPL_BROWSER_PAGES).
"""
from __future__ import annotations

from dataclasses import dataclass

from ..config import settings

MAX_CHARS = 12000
THIN_CHARS = 200


@dataclass
class ExtractOutcome:
    url: str
    title: str = ""
    text: str = ""
    via: str = "static"  # static | browser | fallback
    error: str = ""

    @property
    def ok(self) -> bool:
        return not self.error


def _to_markdown(page, main_only: bool = True) -> tuple[str, str]:
    title = ""
    try:
        title = str(getattr(page, "title", "") or "").strip()
    except Exception:
        title = ""
    try:
        md = page.markdown(main_content_only=main_only)
        text = " ".join(str(md or "").split()).strip()
        return title, text[:MAX_CHARS]
    except Exception:
        pass
    # raw-text fallback from the selector tree
    try:
        text = " ".join(page.get_text(separator=" ").split()).strip()  # type: ignore[attr-defined]
        return title, text[:MAX_CHARS]
    except Exception as exc:
        return title, ""


def _static_extract(url: str) -> ExtractOutcome:
    from scrapling.fetchers import Fetcher

    try:
        page = Fetcher.get(url, timeout=20)
    except Exception as exc:
        return ExtractOutcome(url=url, via="static", error=f"scrapling static fetch failed: {exc}")
    status = int(getattr(page, "status", 200) or 200)
    if status >= 400:
        return ExtractOutcome(url=url, via="static", error=f"http {status}")
    title, text = _to_markdown(page)
    if len(text) < THIN_CHARS:
        return ExtractOutcome(url=url, title=title, via="static", error="thin static content")
    return ExtractOutcome(url=url, title=title[:200], text=text, via="static")


def _browser_extract(url: str) -> ExtractOutcome:
    from scrapling.fetchers import DynamicFetcher

    try:
        page = DynamicFetcher.fetch(url, timeout=45)
    except Exception as exc:
        return ExtractOutcome(url=url, via="browser", error=f"scrapling browser fetch failed: {exc}")
    status = int(getattr(page, "status", 200) or 200)
    if status >= 400:
        return ExtractOutcome(url=url, via="browser", error=f"http {status}")
    title, text = _to_markdown(page)
    if len(text) < THIN_CHARS:
        return ExtractOutcome(url=url, title=title, via="browser", error="no readable text")
    return ExtractOutcome(url=url, title=title[:200], text=text, via="browser")


async def extract(url: str, *, allow_browser: bool | None = None) -> ExtractOutcome:
    """static first; browser only when enabled and static came back thin."""
    import asyncio

    if allow_browser is None:
        allow_browser = settings.scrapl_allow_browser
    static_out = await asyncio.to_thread(_static_extract, url)
    if static_out.ok or not allow_browser:
        return static_out
    return await asyncio.to_thread(_browser_extract, url)
