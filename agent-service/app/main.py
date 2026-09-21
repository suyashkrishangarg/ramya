"""ramya agent harness — fastapi entrypoint.

routes:
  GET  /healthz   liveness (no auth)
  GET  /readyz    llm key + search reachability (no auth, safe for deploy probes)
  POST /v1/chat   the agentic loop, sse stream (bearer auth when BACKEND_SECRET set)
"""
from __future__ import annotations

import time

import httpx
from fastapi import FastAPI, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from .agent.run import run as run_loop
from .config import settings
from .models import ChatRequest
from .security import bearer_ok
from .sse import sse

STARTED = time.monotonic()

app = FastAPI(title="ramya agent harness", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins or ["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["authorization", "content-type"],
    max_age=600,
)


def _deny() -> JSONResponse:
    return JSONResponse({"ok": False, "error": "unauthorized"}, status_code=401)


@app.get("/healthz")
async def healthz() -> dict:
    return {"ok": True, "uptime_s": int(time.monotonic() - STARTED)}


@app.get("/readyz")
async def readyz() -> dict:
    checks: dict[str, object] = {"llm_configured": bool(settings.llm_api_key)}
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get("https://html.duckduckgo.com/html/", params={"q": "test"})
            checks["search_reachable"] = resp.status_code == 200
    except Exception:
        checks["search_reachable"] = False
    try:
        from scrapling.fetchers import Fetcher  # noqa: F401

        checks["extractor"] = "scrapling-static"
        try:
            from scrapling.fetchers import DynamicFetcher  # noqa: F401

            checks["browser_available"] = settings.scrapl_allow_browser
        except Exception:
            checks["browser_available"] = False
    except Exception:
        checks["extractor"] = "missing"
    checks["jina"] = "configured" if settings.jina_api_key else "anonymous"
    ok = bool(checks["llm_configured"]) and checks.get("extractor") == "scrapling-static"
    return {"ok": ok, "checks": checks}


@app.post("/v1/chat")
async def chat(req: ChatRequest, request: Request, authorization: str | None = Header(default=None)):
    if not bearer_ok(authorization, settings.backend_secret):
        return _deny()

    async def gen():
        try:
            async for frame in run_loop(req):
                if await request.is_disconnected():
                    break
                yield frame
        except Exception as exc:  # last-resort guard — loop must never hang the stream
            yield sse("error", {"message": f"harness failure: {type(exc).__name__}"})

    return StreamingResponse(gen(), media_type="text/event-stream")
