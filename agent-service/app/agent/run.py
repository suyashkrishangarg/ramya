"""tool-calling runner: decide → ask? → plan → approve → execute → draft.

stateless: history is resent per turn; phase is derived from the latest
message (question answer? plan approval? fresh question?). every turn ends
in exactly one of: question | plan_proposal | final | error.
"""
from __future__ import annotations

import asyncio
import re
import time
import uuid

from .. import llm as llm_mod
from ..config import settings
from ..llm_tools import complete_with_tools
from ..models import ChatRequest, SourceItem
from ..security import validate_url
from ..sse import sse
from .loop import (
    EVIDENCE_CHARS,
    SNIPPET_CHARS,
    RunState,
    _budgets,
    _history_text,
    _latest_user,
    _time_left,
)
from .prompts import PLAN_PROPOSAL_QUESTION, PLANNER_TOOLS_SYSTEM, SYNTH_SYSTEM
from .toolspec import TOOL_NAMES, TOOLS

__all__ = ["run", "_parse_plan_answer"]

MAX_EVIDENCE_PER_PAGE = 2400


def _is_plan_approval(req: ChatRequest) -> bool:
    latest = req.messages[-1] if req.messages else None
    return bool(latest and latest.role == "user" and latest.intent == "plan_approval")


def _is_question_answer(req: ChatRequest) -> str:
    latest = req.messages[-1] if req.messages else None
    if latest and latest.role == "user" and latest.question_id:
        return latest.question_id
    return ""


def _extract_urls(text: str) -> list[str]:
    found = re.findall(r"https?://[^\s)>\]\"']+", text or "")
    out: list[str] = []
    for u in found:
        u = u.rstrip(".,;!?)")
        ok, _ = validate_url(u)
        if ok and u not in out:
            out.append(u)
        if len(out) >= 10:
            break
    return out


def _parse_plan_answer(req: ChatRequest) -> tuple[list[str], list[str]]:
    """approved queries + extra urls from a plan-approval message + fields."""
    queries: list[str] = []
    for q in req.approved_queries or []:
        q = q.strip()[:200]
        if len(q) >= 3 and q not in queries:
            queries.append(q)
    latest = req.messages[-1] if req.messages else None
    text = latest.content if latest else ""
    for line in text.splitlines():
        s = line.strip()
        if not s or "http" in s:
            continue  # urls handled below
        s = re.sub(r"^[\d\-\*\.\)\s]+", "", s).strip().strip('"')
        if len(s) >= 3 and len(s) <= 200 and s not in queries:
            queries.append(s)
        if len(queries) >= 6:
            break
    urls: list[str] = []
    for u in list(req.must_crawl_urls or []) + _extract_urls(text):
        if u not in urls:
            urls.append(u)
        if len(urls) >= 10:
            break
    return queries[:6], urls[:10]


def _q_events(questions: list, kind: str) -> list[dict]:
    out = []
    for q in questions[:3]:
        text = str(q.get("text", ""))[:300].strip()
        if not text:
            continue
        opts = [str(o)[:80] for o in (q.get("options") or [])[:4] if str(o).strip()]
        out.append({"id": f"q-{uuid.uuid4().hex[:8]}", "text": text, "options": opts, "kind": kind})
    return out


async def _decide(messages: list[dict[str, str]]) -> dict:
    return await complete_with_tools(
        messages,
        TOOLS,
        base_url=settings.llm_base_url,
        api_key=settings.llm_api_key,
        model=settings.llm_model,
        temperature=0.3,
        max_tokens=800,
    )

async def run(req: ChatRequest):
    """main entry — phase derived from latest message; one terminal event."""
    from ..tools import crawl as _crawl
    from ..tools import search as _search

    t0 = time.monotonic()
    budgets = _budgets(req)
    state = RunState()
    state.evidence_text = []  # type: ignore[attr-defined]
    history = _history_text(req)
    latest = _latest_user(req)

    yield sse("status", {"phase": "thinking", "detail": "understanding your request"})

    if not settings.llm_api_key:
        yield sse("error", {"message": "agent llm not configured — set LLM_API_KEY on the harness."})
        return

    plan_mode = _is_plan_approval(req)
    answered_q = _is_question_answer(req)

    if plan_mode:
        async for frame in _run_approved(req, state, budgets, history, latest, t0, _search, _crawl):
            yield frame
        return

    # fresh turn (or question answered) → decide: ask_user | propose_plan
    phase = "decide-after-user-msg"
    if answered_q:
        phase = "decide-after-user-msg"
    context = f"CONVERSATION:\n{history}\n\nCURRENT REQUEST:\n{latest}"
    if answered_q:
        context += f'\n(Note: the user just answered clarifying question {answered_q}: "{latest}".)'
    decide_msgs = [
        {"role": "system", "content": PLANNER_TOOLS_SYSTEM},
        {"role": "user", "content": f"PHASE: {phase}\n\n{context}"},
    ]
    try:
        call = await _decide(decide_msgs)
    except llm_mod.LLMError as exc:
        yield sse("error", {"message": str(exc)})
        return

    name, args = call.get("name"), call.get("args", {})
    if name not in TOOL_NAMES:
        name = "finish"

    if name == "ask_user" and budgets.questions > 0:
        events = _q_events(args.get("questions", []), "clarify")
        if events:
            for e in events[: max(budgets.questions, 1)]:
                yield sse("question", e)
            return
        # agent asked nothing usable → fall through to plan

    if name == "propose_plan" or True:
        queries = []
        if name == "propose_plan":
            for q in args.get("queries", [])[:6]:
                q = str(q).strip()[:200]
                if len(q) >= 3 and q not in queries:
                    queries.append(q)
        if not queries:
            # decide returned finish/ask nothing — draft directly from history
            async for frame in _synthesize(req, state, budgets, history, latest, t0):
                yield frame
            return
        yield sse(
            "plan_proposal",
            {
                "queries": queries,
                "notes": str(args.get("notes", ""))[:400] if name == "propose_plan" else "",
                "question": PLAN_PROPOSAL_QUESTION,
            },
        )
        return

async def _run_approved(req, state, budgets, history, latest, t0, _search, _crawl):
    """user approved the plan (queries + optional must-read urls) → execute → draft."""
    queries, user_urls = _parse_plan_answer(req)
    if not queries and not user_urls:
        yield sse("error", {"message": "plan came back empty — approve one query or url."})
        return

    browser_used: list[str] = []
    state.evidence_text = getattr(state, "evidence_text", [])

    # 1 · user urls ALWAYS crawled first (full scrapling path)
    if user_urls:
        n = len(user_urls)
        word = "page" if n == 1 else "pages"
        yield sse("status", {"phase": "reading", "detail": f"reading your {n} must-read {word} first"})
        results = await asyncio.gather(
            *[_crawl.webcrawl(u, depth="full", mandatory=True) for u in user_urls[: budgets.pages]]
        )
        for url, out in zip(user_urls, results):
            state.pages_used += 1
            if out.via == "browser":
                browser_used.append(url)
            if not out.ok:
                yield sse("tool", {"tool": "webcrawl", "url": url, "error": out.error, "mandatory": True})
                continue
            yield sse(
                "tool",
                {"tool": "webcrawl", "url": url, "title": out.title or url,
                 "extracted_via": out.via, "mandatory": True},
            )
            if not any(s.url == url for s in state.sources):
                state.sources.append(SourceItem(title=out.title or url, url=url))
            state.evidence_text.append(f"SOURCE [{out.title or url}]({url}):\n{out.text[:2400]}")

    # 2 · approved queries → search (quick for facts, deep for research)
    for q in queries[: budgets.queries]:
        if _time_left(budgets) <= 15 or state.queries_used >= budgets.queries:
            break
        mode = "quick" if len(q.split()) <= 8 else "deep"
        yield sse("status", {"phase": "searching", "detail": q})
        outcome = await _search.websearch(q, limit=6, mode=mode)
        state.queries_used += 1
        if outcome.error or not outcome.hits:
            yield sse("tool", {"tool": "websearch", "query": q, "error": outcome.error or "no results"})
            continue
        hits4 = [{"title": h.title, "url": h.url} for h in outcome.hits[:4]]
        yield sse("tool", {"tool": "websearch", "query": q, "results": hits4})
        known = {s.url for s in state.sources}
        for h in outcome.hits:
            if h.url not in known:
                known.add(h.url)
                state.sources.append(SourceItem(title=h.title, url=h.url))
        for h in outcome.hits[:2]:
            if h.snippet:
                state.evidence_text.append(f"[{h.title}]({h.url}): {h.snippet[:600]}")

    # 3 · crawl best discovered hits (skip already-evidenced urls)
    seen_urls: set[str] = set()
    for e in state.evidence_text:
        for m in re.findall(r"https?://[^\s)\]]+", e):
            seen_urls.add(m.rstrip(".,;"))
    fresh = [s for s in state.sources if s.url not in seen_urls]
    fresh = sorted(fresh, key=lambda s: 0 if "wikipedia.org" in s.url or "arxiv.org" in s.url else 1)
    room = max(budgets.pages - state.pages_used, 0)
    fresh = fresh[: min(room, 4)]
    if fresh and _time_left(budgets) > 25:
        n = len(fresh)
        word = "source" if n == 1 else "sources"
        yield sse("status", {"phase": "reading", "detail": f"reading {n} more {word}"})
        results = await asyncio.gather(*[_crawl.webcrawl(s.url, depth="quick") for s in fresh])
        for s, out in zip(fresh, results):
            state.pages_used += 1
            if out.via == "browser":
                browser_used.append(s.url)
            if not out.ok:
                yield sse("tool", {"tool": "webcrawl", "url": s.url, "error": out.error, "mandatory": False})
                continue
            yield sse(
                "tool",
                {"tool": "webcrawl", "url": s.url, "title": out.title or s.title,
                 "extracted_via": out.via, "mandatory": False},
            )
            state.evidence_text.append(f"SOURCE [{out.title or s.title}]({s.url}):\n{out.text[:2400]}")

    # 4 · decide: ready → draft; one bounded re-search allowed; then draft
    if state.evidence_text and _time_left(budgets) > 30:
        decide_msgs = [
            {"role": "system", "content": PLANNER_TOOLS_SYSTEM},
            {"role": "user", "content": f"PHASE: decide-after-evidence\nUSER ASKED: {latest}"},
        ]
        try:
            call = await _decide(decide_msgs)
        except llm_mod.LLMError:
            call = {"name": "finish", "args": {}}
        if call.get("name") == "websearch":
            q = str(call.get("args", {}).get("query", ""))[:300]
            ok_budget = state.queries_used < budgets.queries and _time_left(budgets) > 25
            if q and ok_budget:
                yield sse("status", {"phase": "searching", "detail": q})
                outcome = await _search.websearch(q, limit=5, mode="deep")
                state.queries_used += 1
                if outcome.hits:
                    hits3 = [{"title": h.title, "url": h.url} for h in outcome.hits[:3]]
                    yield sse("tool", {"tool": "websearch", "query": q, "results": hits3})
                    for h in outcome.hits[:2]:
                        if h.url not in {s.url for s in state.sources}:
                            state.sources.append(SourceItem(title=h.title, url=h.url))

    async for frame in _synthesize(req, state, budgets, history, latest, t0, browser_used):
        yield frame

async def _synthesize(req, state, budgets, history, latest, t0, browser_used=None):
    """streamed cited draft → final {answer, sources, stats}."""
    browser_used = browser_used or []
    evidence_joined = "\n\n".join(getattr(state, "evidence_text", []))[:EVIDENCE_CHARS]
    synth_messages = [
        {"role": "system", "content": SYNTH_SYSTEM},
        {"role": "user", "content": f"CONVERSATION:\n{history}\nREQUEST:\n{latest}\nEVIDENCE:\n{evidence_joined}"},
    ]
    yield sse("status", {"phase": "writing", "detail": "putting it together"})
    full: list[str] = []
    try:
        async for delta in llm_mod.complete_stream(
            synth_messages,
            base_url=settings.llm_base_url,
            api_key=settings.llm_api_key,
            model=settings.llm_model,
            temperature=0.4,
            max_tokens=2000,
        ):
            full.append(delta)
            yield sse("partial", {"text": delta})
    except llm_mod.LLMError as exc:
        if not full:
            yield sse("error", {"message": str(exc)})
            return
    ms = int((time.monotonic() - t0) * 1000)
    yield sse(
        "final",
        {
            "answer": "".join(full),
            "sources": [s.model_dump() for s in state.sources[:12]],
            "stats": {
                "queries": state.queries_used,
                "pages": state.pages_used,
                "browser_pages": len(browser_used),
                "ms": ms,
                "model": settings.llm_model,
            },
        },
    )

