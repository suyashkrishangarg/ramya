"""sse framing — one `event:` + `data:` block per harness event."""
from __future__ import annotations

import json
from typing import Any


def sse(event: str, data: dict[str, Any]) -> str:
    """format a single sse frame. frontend parses via eventsource/readable-stream."""
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"
