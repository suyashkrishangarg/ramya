import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/member";
import { hasChatAccess } from "@/lib/chat-access";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
// streaming research can run long; hobby functions cap at 60s — `chat` fits,
// `deep` may be cut on hobby (upgrade path documented in README)
export const maxDuration = 60;

const MODES = new Set(["chat", "research", "deep"]);
const URL_RE = /^https?:\/\/[^\s"'<>]+$/i;

type WireMsg = {
  role: "user" | "assistant" | "system";
  content: string;
  question_id?: string;
  intent?: "chat" | "plan_approval";
};

function clampText(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

/** validate + clamp the client payload into the harness wire shape */
function toBackendBody(raw: Record<string, unknown>) {
  const msgsIn = Array.isArray(raw.messages) ? raw.messages.slice(-24) : [];
  const messages: WireMsg[] = [];
  for (const m of msgsIn) {
    const o = m as Record<string, unknown>;
    const role = o.role === "assistant" ? "assistant" : "user";
    const content = clampText(o.content, 12_000);
    if (!content) continue;
    const msg: WireMsg = { role, content };
    if (typeof o.question_id === "string") msg.question_id = o.question_id.slice(0, 64);
    if (o.intent === "plan_approval") msg.intent = "plan_approval";
    messages.push(msg);
  }
  if (messages.length === 0) return null;

  const body: Record<string, unknown> = {
    messages,
    mode: MODES.has(raw.mode as string) ? raw.mode : "research",
  };
  if (Array.isArray(raw.approved_queries)) {
    body.approved_queries = raw.approved_queries
      .filter((q): q is string => typeof q === "string")
      .map((q) => q.trim().slice(0, 200))
      .filter(Boolean)
      .slice(0, 6);
  }
  if (Array.isArray(raw.must_crawl_urls)) {
    body.must_crawl_urls = raw.must_crawl_urls
      .filter((u): u is string => typeof u === "string")
      .map((u) => u.trim().slice(0, 500))
      .filter((u) => URL_RE.test(u))
      .slice(0, 10);
  }
  return body;
}

/** POST /api/chat — authed, allowlisted proxy to the python harness (SSE). */
export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) {
    return NextResponse.json(
      { ok: false, error: "sign in to use the chat beta.", next: "/signup?next=/chat" },
      { status: 401 },
    );
  }

  const allowed = await hasChatAccess(member.email);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "chat is invite-only right now — request access from /contact." },
      { status: 403 },
    );
  }

  // two-tier limiter: burst guard + hourly allowance per member
  const ip = clientIp(req.headers);
  if (
    !rateLimit(`chat-burst:${member.email}:${ip}`, 5, 30_000) ||
    !rateLimit(`chat-hour:${member.email}`, 20, 60 * 60_000)
  ) {
    return NextResponse.json(
      { ok: false, error: "slow down — a few runs per hour while we're in beta." },
      { status: 429 },
    );
  }

  const backendUrl = process.env.PYTHON_AGENT_URL;
  const backendSecret = process.env.CHAT_BACKEND_SECRET;
  if (!backendUrl || !backendSecret) {
    console.error("[chat] harness not configured — set PYTHON_AGENT_URL + CHAT_BACKEND_SECRET");
    return NextResponse.json(
      { ok: false, error: "chat backend isn't configured yet — we're on it." },
      { status: 503 },
    );
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request." }, { status: 400 });
  }
  const body = toBackendBody(raw);
  if (!body) {
    return NextResponse.json({ ok: false, error: "message is empty." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${backendUrl.replace(/\/+$/, "")}/v1/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${backendSecret}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(300_000),
    });
  } catch {
    // free-tier render sleeps ~15 min idle — a cold boot looks exactly like this
    return NextResponse.json(
      { ok: false, error: "the agent is waking up — try again in ~30 seconds." },
      { status: 502 },
    );
  }

  if (upstream.status === 401 || upstream.status === 403) {
    console.error("[chat] harness rejected our secret — check CHAT_BACKEND_SECRET");
    return NextResponse.json(
      { ok: false, error: "chat backend auth failed — we're on it." },
      { status: 502 },
    );
  }
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { ok: false, error: "chat backend error — try again shortly." },
      { status: 502 },
    );
  }

  // stream the harness sse straight through to the browser
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "use POST." }, { status: 405 });
}
