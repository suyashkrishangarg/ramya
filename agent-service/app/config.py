"""ramya agent harness — config from environment (no secrets in code)."""
from __future__ import annotations

import os


def _get(name: str, default: str) -> str:
    return os.getenv(name, default).strip()


def _get_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)).strip())
    except (ValueError, AttributeError):
        return default


def _get_bool(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


class Settings:
    # llm — nvidia nim, openai-compatible chat-completions.
    # hosted base: https://integrate.api.nvidia.com/v1
    llm_base_url: str = _get("LLM_BASE_URL", "https://integrate.api.nvidia.com/v1").rstrip("/")
    llm_api_key: str = _get("LLM_API_KEY", "")
    llm_model: str = _get("LLM_MODEL", "deepseek-ai/deepseek-v4-flash-0731")

    # jina fast path — optional key raises rate limits; anonymous still works.
    jina_api_key: str = _get("JINA_API_KEY", "")

    # scrapling extraction — static first; browser escalation is opt-in
    # (needs headless deps + ram on the host; default off for v1).
    scrapl_allow_browser: bool = _get_bool("SCRAPL_ALLOW_BROWSER", False)
    scrapl_browser_pages: int = _get_int("SCRAPL_BROWSER_PAGES", 2)

    # auth — next.js proxy must send `authorization: bearer <secret>`
    backend_secret: str = _get("BACKEND_SECRET", "")

    # cors — comma-separated site origins
    site_origin: str = _get("SITE_ORIGIN", "http://localhost:3000,https://ramyaai.tech")

    # loop budgets
    wall_time_s: int = _get_int("AGENT_WALL_TIME_S", 120)
    max_queries: int = _get_int("AGENT_MAX_QUERIES", 6)
    max_pages: int = _get_int("AGENT_MAX_PAGES", 8)
    max_questions: int = _get_int("AGENT_MAX_QUESTIONS", 3)
    max_decide_steps: int = _get_int("AGENT_MAX_DECIDE_STEPS", 8)

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.site_origin.split(",") if o.strip()]


settings = Settings()
