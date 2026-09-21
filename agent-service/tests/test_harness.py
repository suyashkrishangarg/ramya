"""no-network unit tests: sse framing, auth, ssrf guards, loop parsers,
tool-call fallback parsing, plan-answer parsing, scrapling extractor (fixture)."""
from __future__ import annotations

import pytest

from app.agent.loop import _budgets, _parse_clarifications, _parse_queries
from app.agent.run import _extract_urls, _parse_plan_answer
from app.llm_tools import parse_tool_blob
from app.models import ChatMessage, ChatRequest
from app.security import bearer_ok, validate_url
from app.sse import sse


def test_sse_frame_shape():
    frame = sse("status", {"phase": "thinking"})
    assert frame.startswith("event: status\n")
    assert 'data: {"phase": "thinking"}' in frame
    assert frame.endswith("\n\n")


def test_bearer_open_mode_allows_all():
    assert bearer_ok(None, "") is True
    assert bearer_ok("Bearer anything", "") is True


def test_bearer_locked_mode():
    assert bearer_ok("Bearer s3cret", "s3cret") is True
    assert bearer_ok("bearer s3cret", "s3cret") is True
    assert bearer_ok("Bearer wrong", "s3cret") is False
    assert bearer_ok(None, "s3cret") is False
    assert bearer_ok("Token s3cret", "s3cret") is False


@pytest.mark.parametrize(
    "url",
    [
        "http://localhost/x",
        "http://127.0.0.1/",
        "http://169.254.169.254/latest/meta-data/",
        "http://metadata.google.internal/",
        "ftp://example.com/file",
        "http://example.com:22/",
        "http://user:pass@example.com/",
        "gopher://example.com/",
    ],
)
def test_validate_url_blocks_bad(url):
    ok, _reason = validate_url(url)
    assert ok is False


def test_validate_url_allows_public_https():
    ok, _ = validate_url("https://en.wikipedia.org/wiki/Agents")
    assert ok is True


def test_parse_queries_plain():
    out = _parse_queries("1. best open-source routers\n2. latest pricing 2026")
    assert out == ["best open-source routers", "latest pricing 2026"]


def test_parse_queries_no_search():
    assert _parse_queries("NO_SEARCH_NEEDED") == []


def test_parse_clarifications_shape():
    raw = "Q: How deep should I go?\nOPTIONS: quick overview | standard research | deep dive"
    out = _parse_clarifications(raw)
    assert len(out) == 1
    assert out[0]["text"] == "How deep should I go?"
    assert out[0]["options"] == ["quick overview", "standard research", "deep dive"]
    assert out[0]["id"].startswith("q-")


def test_budgets_clamp_request_overrides(monkeypatch):
    # pydantic caps absurd overrides at the schema layer…
    with pytest.raises(Exception):
        ChatRequest(
            messages=[ChatMessage(role="user", content="hi")],
            max_queries=99,
        )
    # …and the server clamps legal overrides down to env budgets.
    monkeypatch.setenv("AGENT_MAX_QUERIES", "2")
    monkeypatch.setenv("AGENT_MAX_PAGES", "2")
    monkeypatch.setenv("AGENT_MAX_QUESTIONS", "1")
    import importlib

    import app.config as cfg

    importlib.reload(cfg)
    from app.agent import loop as loop_mod

    importlib.reload(loop_mod)
    req = ChatRequest(
        messages=[ChatMessage(role="user", content="hi")],
        max_queries=8,
        max_pages=10,
        max_questions=3,
    )
    b = loop_mod._budgets(req)
    assert b.queries <= 2
    assert b.pages <= 2
    assert b.questions <= 1


def test_parse_tool_blob_native_shape():
    raw = 'Let me search. {"tool": "websearch", "args": {"query": "nim pricing", "mode": "quick"}}'
    out = parse_tool_blob(raw)
    assert out == {"name": "websearch", "args": {"query": "nim pricing", "mode": "quick"}}


def test_parse_tool_blob_fenced():
    raw = '```json\n{"tool": "webcrawl", "args": {"url": "https://example.com", "depth": "full"}}\n```'
    out = parse_tool_blob(raw)
    assert out is not None and out["name"] == "webcrawl"


def test_parse_tool_blob_none():
    assert parse_tool_blob("just some prose, no tool call") is None
    assert parse_tool_blob("") is None


def test_extract_urls_dedupe_and_validate():
    text = "read https://example.com/a and https://example.com/a plus http://127.0.0.1/x"
    out = _extract_urls(text)
    assert out == ["https://example.com/a"]


def test_parse_plan_answer_fields_and_text():
    req = ChatRequest(
        messages=[
            ChatMessage(role="user", content="compare nim vs ollama"),
            ChatMessage(role="assistant", content="plan..."),
            ChatMessage(
                role="user",
                content="looks good, also read https://example.com/deep-dive please",
                intent="plan_approval",
            ),
        ],
        approved_queries=["nim pricing 2026", "ollama benchmarks"],
        must_crawl_urls=["https://example.com/docs"],
    )
    queries, urls = _parse_plan_answer(req)
    assert "nim pricing 2026" in queries
    assert "https://example.com/docs" in urls
    assert "https://example.com/deep-dive" in urls


def test_scrapling_extract_fixture(monkeypatch):
    from app.tools import extract as extract_mod

    html = (
        "<html><head><title>Fixture</title></head><body><article><h1>Head</h1>"
        + "<p>" + ("lorem ipsum dolor sit amet. " * 40) + "</p></article></body></html>"
    )

    class FakePage:
        status = 200

        def markdown(self, main_content_only=True):
            return "# Head\n\n" + ("lorem ipsum dolor sit amet. " * 40)

    class FakeFetcher:
        @staticmethod
        def get(url, timeout=20):
            return FakePage()

    monkeypatch.setattr("scrapling.fetchers.Fetcher.get", FakeFetcher.get)
    out = extract_mod._static_extract("https://example.com/x")
    assert out.ok is True
    assert out.via == "static"
    assert "lorem ipsum" in out.text


def test_scrapling_thin_content_flagged(monkeypatch):
    from app.tools import extract as extract_mod

    class ThinPage:
        status = 200

        def markdown(self, main_content_only=True):
            return "cookie banner… accept?"

    class FakeFetcher:
        @staticmethod
        def get(url, timeout=20):
            return ThinPage()

    monkeypatch.setattr("scrapling.fetchers.Fetcher.get", FakeFetcher.get)
    out = extract_mod._static_extract("https://example.com/thin")
    assert out.ok is False  # thin → eligible for browser escalation, not silently used

