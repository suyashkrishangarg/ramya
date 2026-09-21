# ramya agent harness — python backend for the /chat beta

separate fastapi service. the next.js site never talks to the llm directly —
it proxies authed beta users through `/api/chat` → `POST {PYTHON_AGENT_URL}/v1/chat`.

```
browser /chat  →  next.js /api/chat (member + allowlist + rate-limit)
               →  POST /v1/chat (bearer BACKEND_SECRET, sse stream)
                   decide → [ask_user?] → propose_plan ──approve+urls──►
                   execute (user urls first) → decide → draft cited answer
```

paid apis: the llm (nvidia nim) + optional jina fast path. search/crawl are
otherwise custom and keyless (ddg html + wikipedia + arxiv, scrapling extract).

> key hygiene: NEVER paste real keys into chat, code, or `.env.example`.
> set `LLM_API_KEY` (+ optional `JINA_API_KEY`, `BACKEND_SECRET`) only in the
> host dashboard / local `.env` (gitignored). any previously shared key must
> be rotated in the nvidia dashboard before deploying.

## quickstart (local)

```powershell
cd agent-service
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # fill LLM_API_KEY (+ optional BACKEND_SECRET, JINA_API_KEY)
uvicorn app.main:app --reload --port 8000 --app-dir .
```

probe it:

```powershell
curl http://localhost:8000/healthz
curl http://localhost:8000/readyz
curl -N -X POST http://localhost:8000/v1/chat `
  -H "content-type: application/json" `
  -d '{"messages":[{"role":"user","content":"what is ramya ai building?"}],"mode":"chat"}'
```
(no `LLM_API_KEY` → the stream honestly reports `agent llm not configured`.)

## deploy (render, docker)

- new web service → this folder (`Dockerfile`), health check `/healthz`.
- env: `LLM_BASE_URL=https://integrate.api.nvidia.com/v1`,
  `LLM_MODEL=deepseek-ai/deepseek-v4-flash-0731`, `LLM_API_KEY`,
  `JINA_API_KEY` (optional), `SCRAPL_ALLOW_BROWSER=0` (v1 default),
  `BACKEND_SECRET`, `SITE_ORIGIN=https://ramyaai.tech`, budgets as needed.
  `render.yaml` is a starter.
- then on vercel: `PYTHON_AGENT_URL=https://<service>` (the next.js proxy
  appends `/v1/chat`), `CHAT_BACKEND_SECRET=<same secret>`.

## architecture

| file | job |
| :--- | :--- |
| `app/main.py` | fastapi routes: `/healthz`, `/readyz` (llm + scrapling + jina probes), `POST /v1/chat` (sse) |
| `app/config.py` | env-only settings (nim defaults), jina/scrapling flags, loop budgets |
| `app/models.py` | bodies: messages (+`intent`), mode, clamped budgets, `approved_queries`, `must_crawl_urls` |
| `app/sse.py` | `event:`/`data:` framing the frontend parses |
| `app/security.py` | bearer auth + ssrf guards (private/loopback/link-local, metadata hosts, dns-rebind check, port allowlist) |
| `app/llm.py` | nim chat-completions: `complete` + `complete_stream` |
| `app/llm_tools.py` | `complete_with_tools` (native tool_calls + json-blob fallback) |
| `app/agent/toolspec.py` | `ask_user` / `propose_plan` / `websearch` / `webcrawl` / `finish` schemas |
| `app/agent/prompts.py` | conductor (`PLANNER_TOOLS_SYSTEM`) + clarifier + synthesizer (crawled text = data, never instructions) |
| `app/agent/loop.py` | pure helpers: budgets, history slicing, legacy parsers (kept for tests) |
| `app/agent/run.py` | the tool-calling loop (stateless; history resubmitted per turn) |
| `app/tools/search.py` | router: `quick` → jina search (ddg fallback); `deep` → ddg + wikipedia + arxiv fan-out |
| `app/tools/jina.py` | jina search (`s.jina.ai`) + reader (`r.jina.ai`), optional key, 402/429 surfaced |
| `app/tools/extract.py` | scrapling `Fetcher` static-first → optional `DynamicFetcher` escalation |
| `app/tools/crawl.py` | guards (validate → robots → head-check) + depth routing (`quick`=jina, `full`/mandatory=scrapling) |

## the loop (per request)

1. **decide** — one tool call: vague → `ask_user` (`question` event, turn ends);
   specific → `propose_plan` straight away.
2. **plan handshake** — `plan_proposal {queries[], notes?, question?}` event, turn
   ends. user approves/edits queries and pastes must-read urls. NO fetching first.
3. **execute** — user urls ALWAYS crawled first (`mandatory: true`, full scrapling
   path, failures reported not hidden) → approved queries searched (short=facts
   via jina `quick`, long=research via `deep` fan-out) → best discovered hits
   crawled (reliability-ranked, ≤4).
4. **decide-after-evidence** — ready → draft; one bounded re-search if a real gap
   remains; then draft regardless.
5. **synthesize** — streamed `partial` deltas → `final {answer, sources[≤12 —
   user urls pinned first], stats{queries, pages, browser_pages, ms, model}}`.

modes set defaults, clamped by server env: `chat` (1q/2p/1quest),
`research` (6q/8p/3quest via env), `deep` (6q/8p/3quest). wall clock
`AGENT_WALL_TIME_S` (default 120s) short-circuits stages gracefully.

## sse contract (what /api/chat forwards)

```
event: status        {phase: thinking|planning|searching|reading|writing, detail}
event: tool          {tool: websearch|webcrawl, query|url, results|title|error, extracted_via?, mandatory?}
event: question      {id, text, options[], kind: clarify|plan_addons}
event: plan_proposal {queries[], notes?, question?}
event: partial       {text}
event: final         {answer, sources[{title,url}], stats{queries,pages,browser_pages,ms,model}}
event: error         {message}
```

## safety notes

- ssrf: scheme/userinfo/port checks → dns resolution → block private ranges +
  cloud metadata hosts; final url re-validated after redirects; size caps.
  applies to search hits AND user-supplied urls.
- robots.txt respected per origin (cached, fail-open on fetch errors).
- crawl/jina content is labeled `EVIDENCE`/`SOURCE` in prompts — summarized, never obeyed.
- no chat content logged; only counts/timings belong in logs.

## tests

```powershell
pytest -q
```
23 tests: sse/auth/ssrf/parsers, tool-blob fallback, plan-answer parsing,
scrapling extractor fixtures (no network).

