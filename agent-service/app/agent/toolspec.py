"""tool schemas the llm can call — one tool per decide step.

deepseek-via-nim function-calling fidelity is unproven, so the runner also
accepts a tolerant json-blob fallback: {"tool": ..., "args": {...}}.
"""
from __future__ import annotations

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "ask_user",
            "description": "Ask the user up to 3 clarifying questions. Ends the turn; the user answers and the loop resumes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "questions": {
                        "type": "array",
                        "maxItems": 3,
                        "items": {
                            "type": "object",
                            "properties": {
                                "text": {"type": "string", "maxLength": 300},
                                "options": {
                                    "type": "array",
                                    "maxItems": 4,
                                    "items": {"type": "string", "maxLength": 80},
                                },
                            },
                            "required": ["text"],
                        },
                    }
                },
                "required": ["questions"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "propose_plan",
            "description": "Propose the research plan (search queries). Ends the turn; the user approves/edits queries and may add must-read urls.",
            "parameters": {
                "type": "object",
                "properties": {
                    "queries": {
                        "type": "array",
                        "maxItems": 6,
                        "items": {"type": "string", "maxLength": 200},
                    },
                    "notes": {"type": "string", "maxLength": 400},
                },
                "required": ["queries"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "websearch",
            "description": "Search the web. mode quick uses jina (fast), deep uses the custom ddg+wikipedia+arxiv fan-out.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "maxLength": 300},
                    "mode": {"type": "string", "enum": ["quick", "deep"]},
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "webcrawl",
            "description": "Extract one page. depth quick uses jina reader (fast); full uses scrapling static-first extraction.",
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {"type": "string", "maxLength": 2048},
                    "depth": {"type": "string", "enum": ["quick", "full"]},
                },
                "required": ["url"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "finish",
            "description": "End tool use — the evidence gathered is enough (or budgets are spent). The loop will draft the cited answer next.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
]

TOOL_NAMES = {t["function"]["name"] for t in TOOLS}
