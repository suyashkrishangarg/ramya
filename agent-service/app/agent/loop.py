"""the loop: clarify → plan → search → crawl → gap-check → question? → synthesize.

stateless: the full message history arrives per request (the next.js layer owns
the thread). a turn ends either with `final` (answer + sources) or `question`
(the user answers, the client resends history, the loop resumes narrowed).
"""
from __future__ import annotations

import asyncio
import re
import time
import uuid
from dataclasses import dataclass, field

from .. import llm as llm_mod
from ..config import settings
from ..models import ChatRequest, SourceItem
from ..sse import sse
from ..tools import crawl as crawl_mod
from ..tools import search as search_mod
from .prompts import CLARIFY_SYSTEM, PLANNER_SYSTEM, SYNTH_SYSTEM

MODE_DEFAULTS = {
    "chat": {"queries": 1, "pages": 2, "questions": 1},
    "research": {"queries": 4, "pages": 5, "questions": 2},
    "deep": {"queries": 6, "pages": 8, "questions": 3},
}

HISTORY_CHARS = 6000  # recent history fed to planner/synthesizer
EVIDENCE_CHARS = 18000  # web evidence fed to the final synthesis
SNIPPET_CHARS = 600


@dataclass
class Budgets:
    queries: int
    pages: int
    questions: int
    deadline: float


@dataclass
class RunState:
    queries_used: int = 0
    pages_used: int = 0
    sources: list[SourceItem] = field(default_factory=list)
    evidence: list[str] = field(default_factory=list)


def _budgets(req: ChatRequest) -> Budgets:
    d = MODE_DEFAULTS[req.mode]
    queries = min(req.max_queries if req.max_queries is not None else d["queries"], settings.max_queries, 8)
    pages = min(req.max_pages if req.max_pages is not None else d["pages"], settings.max_pages, 10)
    questions = min(
        req.max_questions if req.max_questions is not None else d["questions"],
        settings.max_questions,
        3,
    )
    return Budgets(
        queries=queries,
        pages=pages,
        questions=questions,
        deadline=time.monotonic() + settings.wall_time_s,
    )


def _history_text(req: ChatRequest) -> str:
    lines = []
    for m in req.messages[-12:]:
        tag = {"user": "USER", "assistant": "RAMYA", "system": "SYS"}.get(m.role, "USER")
        lines.append(f"{tag}: {m.content.strip()}")
        if sum(len(x) for x in lines) > HISTORY_CHARS:
            break
    return "\n".join(lines)


def _latest_user(req: ChatRequest) -> str:
    for m in reversed(req.messages):
        if m.role == "user":
            return m.content.strip()
    return ""


def _last_was_question_answer(req: ChatRequest) -> str:
    """if the latest user msg answers a clarifying question, return its id."""
    latest = req.messages[-1] if req.messages else None
    if latest and latest.role == "user" and latest.question_id:
        return latest.question_id
    return ""


def _time_left(b: Budgets) -> float:
    return b.deadline - time.monotonic()


async def _llm(messages: list[dict[str, str]], *, max_tokens: int, temp: float) -> str:
    return await llm_mod.complete(
        messages,
        base_url=settings.llm_base_url,
        api_key=settings.llm_api_key,
        model=settings.llm_model,
        temperature=temp,
        max_tokens=max_tokens,
    )


def _parse_queries(raw: str) -> list[str]:
    raw = raw.strip()
    if "NO_SEARCH_NEEDED" in raw.upper():
        return []
    queries = []
    for line in raw.splitlines():
        line = re.sub(r"^[\d\-\*\.\)\s]+", "", line).strip().strip('"')
        if len(line) >= 3:
            queries.append(line[:200])
        if len(queries) >= 6:
            break
    return queries


def _parse_clarifications(raw: str) -> list[dict]:
    out: list[dict] = []
    lines = [ln.strip() for ln in raw.splitlines() if ln.strip()]
    i = 0
    while i < len(lines) and len(out) < 3:
        if lines[i].upper().startswith("Q:"):
            q = lines[i][2:].strip()
            opts: list[str] = []
            if i + 1 < len(lines) and lines[i + 1].upper().startswith("OPTIONS:"):
                opts = [o.strip() for o in lines[i + 1][8:].split("|") if o.strip()][:4]
                i += 1
            if q:
                out.append({"id": f"q-{uuid.uuid4().hex[:8]}", "text": q[:300], "options": opts})
        i += 1
    return out
