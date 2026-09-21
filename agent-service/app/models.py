"""request/response models for the chat harness api."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"] = "user"
    content: str = Field(min_length=1, max_length=12000)
    # when the user answers a clarifying question, echo the question id here
    question_id: str | None = Field(default=None, max_length=64)
    # plan_approval marks the message that confirms/edits the research plan
    intent: Literal["chat", "plan_approval"] = "chat"


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1, max_length=50)
    mode: Literal["chat", "research", "deep"] = "research"
    # per-request budget overrides — server clamps them to safe ceilings
    max_queries: int | None = Field(default=None, ge=0, le=8)
    max_pages: int | None = Field(default=None, ge=0, le=10)
    max_questions: int | None = Field(default=None, ge=0, le=3)
    # plan handshake — approved/edited queries + user-supplied must-crawl urls
    approved_queries: list[str] | None = Field(default=None, max_length=6)
    must_crawl_urls: list[str] | None = Field(default=None, max_length=10)


class SourceItem(BaseModel):
    title: str
    url: str
