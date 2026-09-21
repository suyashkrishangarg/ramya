"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PlanCard } from "./plan-card";
import { RunTimeline } from "./run-timeline";
import {
  toWireHistory,
  type AgentQuestion,
  type AgentStatus,
  type ChatMode,
  type RunStats,
  type Source,
  type ToolRow,
  type UiMsg,
} from "./chat-types";

const EXAMPLES = [
  "compare the top 3 hybrid ai agent pricing models for 2026",
  "read supabase.com/docs/auth and summarize google oauth setup",
  "what changed in next.js 16 that affects streaming responses?",
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatClient({ email }: { email: string; name: string | null }) {
  const [msgs, setMsgs] = useState<UiMsg[]>([]);
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [tools, setTools] = useState<ToolRow[]>([]);
  const [stats, setStats] = useState<RunStats | null>(null);
  const [mode, setMode] = useState<ChatMode>("research");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [showJump, setShowJump] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const stickRef = useRef(true);
  const streamIdRef = useRef<string | null>(null);

  // autoscroll while the user stays near the bottom; jump button otherwise
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    stickRef.current = near;
    setShowJump(!near);
  }, []);

  useEffect(() => {
    if (stickRef.current) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [msgs, status]);

  useEffect(() => {
    if (!busy) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") abortRef.current?.abort();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy]);

  function finishStream() {
    streamIdRef.current = null;
    setStatus(null);
  }

  const handleEvent = useCallback(function handleEvent(event: string, data: Record<string, unknown>) {
    if (event === "status") {
      setStatus({
        phase: String(data.phase ?? ""),
        detail: data.detail ? String(data.detail) : undefined,
      });
    } else if (event === "tool") {
      setTools((t) => [
        ...t,
        {
          kind: data.tool === "websearch" ? "search" : "crawl",
          label: String(data.query ?? data.url ?? ""),
          title: data.title ? String(data.title) : undefined,
          results: Array.isArray(data.results) ? (data.results as Source[]) : undefined,
          error: data.error ? String(data.error) : undefined,
          mandatory: Boolean(data.mandatory),
          extractedVia: data.extracted_via ? String(data.extracted_via) : undefined,
        },
      ]);
    } else if (event === "question") {
      finishStream();
      setMsgs((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          text: "",
          question: {
            id: String(data.id ?? uid()),
            text: String(data.text ?? ""),
            options: Array.isArray(data.options) ? data.options.map(String) : undefined,
            kind: data.kind ? String(data.kind) : undefined,
          },
        },
      ]);
    } else if (event === "plan_proposal") {
      finishStream();
      setMsgs((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          text: "",
          plan: {
            queries: Array.isArray(data.queries) ? data.queries.map(String) : [],
            notes: data.notes ? String(data.notes) : undefined,
            question: data.question ? String(data.question) : undefined,
          },
        },
      ]);
    } else if (event === "partial") {
      const delta = String(data.text ?? "");
      if (!delta) return;
      const sid = streamIdRef.current;
      if (!sid) {
        const nid = uid();
        streamIdRef.current = nid;
        setMsgs((m) => [...m, { id: nid, role: "assistant", text: delta }]);
        return;
      }
      setMsgs((m) => m.map((x) => (x.id === sid ? { ...x, text: x.text + delta } : x)));
    } else if (event === "final") {
      const answer = String(data.answer ?? "");
      const sources = Array.isArray(data.sources) ? (data.sources as Source[]) : undefined;
      const st = (data.stats ?? null) as RunStats | null;
      setStats(st ?? null);
      const sid = streamIdRef.current;
      if (sid) {
        setMsgs((m) => m.map((x) => (x.id === sid ? { ...x, text: answer || x.text, sources } : x)));
      } else if (answer) {
        setMsgs((m) => [...m, { id: uid(), role: "assistant", text: answer, sources }]);
      }
      finishStream();
    } else if (event === "error") {
      finishStream();
      setMsgs((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          text: String(data.message ?? "something went wrong."),
          error: true,
        },
      ]);
    }
  }, []);

  /** stream one harness turn; resolves when the turn ends (question/plan/final/error) */
  const runStream = useCallback(
    async (
      userMsg: UiMsg,
      extra: { approvedQueries?: string[]; mustCrawlUrls?: string[] } = {},
    ) => {
      const next = [...msgs, userMsg];
      setMsgs(next);
      setBusy(true);
      setTools([]);
      setStats(null);
      const ac = new AbortController();
      abortRef.current = ac;

      const body: Record<string, unknown> = {
        messages: toWireHistory(next),
        mode,
        ...extra,
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
          signal: ac.signal,
        });
        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          setMsgs((m) => [
            ...m,
            {
              id: uid(),
              role: "assistant",
              text: data?.error ?? "something went wrong — try again.",
              error: true,
            },
          ]);
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let idx: number;
          while ((idx = buf.indexOf("\n\n")) !== -1) {
            const frame = buf.slice(0, idx);
            buf = buf.slice(idx + 2);
            const evLine = frame.split("\n").find((l) => l.startsWith("event: "));
            const dataLine = frame.split("\n").find((l) => l.startsWith("data: "));
            if (!evLine || !dataLine) continue;
            try {
              handleEvent(evLine.slice(7).trim(), JSON.parse(dataLine.slice(6)) as Record<string, unknown>);
            } catch {
              /* malformed frame — skip it */
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMsgs((m) => [
            ...m,
            { id: uid(), role: "assistant", text: "connection dropped — try again.", error: true },
          ]);
        }
      } finally {
        if (streamIdRef.current) finishStream();
        setBusy(false);
        setStatus(null);
        abortRef.current = null;
      }
    },
    [msgs, mode, handleEvent],
  );

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    void runStream({ id: uid(), role: "user", text });
  }, [draft, busy, runStream]);

  /** answer a clarifying question (option pill or free text) */
  const answerQuestion = useCallback(
    (questionId: string, answer: string) => {
      if (!answer || busy) return;
      void runStream({ id: uid(), role: "user", text: answer, questionId });
    },
    [busy, runStream],
  );

  /** approve (possibly edited) queries + must-read urls → execute the plan */
  const approvePlan = useCallback(
    (queries: string[], urls: string[]) => {
      if (busy) return;
      const summary =
        [queries.length ? `approved ${queries.length} queries` : "", urls.length ? `${urls.length} must-read urls` : ""]
          .filter(Boolean)
          .join(" + ") || "approved (no changes)";
      void runStream(
        { id: uid(), role: "user", text: summary, questionId: undefined },
        { approvedQueries: queries, mustCrawlUrls: urls },
      );
      // mark every open plan card as decided
      setMsgs((m) =>
        m.map((x) =>
          x.role === "assistant" && x.plan && !x.planDone ? { ...x, planDone: true } : x,
        ),
      );
    },
    [busy, runStream],
  );

  function stop() {
    abortRef.current?.abort();
  }

  const started = msgs.length > 0;

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] w-full pt-14">
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <section className="relative flex min-w-0 flex-1 flex-col border-line lg:border-r">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            role="log"
            aria-label="chat thread"
            className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-8"
            style={{ minHeight: 0 }}
          >
            {started ? (
              <div className="mx-auto max-w-2xl space-y-6">
                {msgs.map((m) => (
                  <MessageBlock key={m.id} m={m} busy={busy} onAnswer={answerQuestion} onApprove={approvePlan} />
                ))}
                {busy && <StatusLine status={status} />}
              </div>
            ) : (
              <EmptyState onPick={(t) => setDraft(t)} />
            )}
          </div>

          {showJump && (
            <button
              type="button"
              onClick={() => {
                stickRef.current = true;
                setShowJump(false);
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
              }}
              className="absolute bottom-36 left-1/2 z-10 -translate-x-1/2 border border-line-strong bg-surface px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] text-muted transition-colors hover:text-ink"
            >
              jump to latest ↓
            </button>
          )}

          <Composer
            email={email}
            draft={draft}
            setDraft={setDraft}
            busy={busy}
            mode={mode}
            setMode={setMode}
            started={started}
            onSend={send}
            onStop={stop}
          />
        </section>

        <aside className="hidden w-72 shrink-0 lg:block" aria-label="run timeline">
          <RunTimeline active={busy} status={status} tools={tools} stats={stats} />
        </aside>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="mx-auto max-w-2xl pt-10 sm:pt-16">
      <p className="eyebrow">ramya · chat beta</p>
      <h1 className="font-display mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
        ask. it researches.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        websearch, webcrawl and multi-step research — with a plan you approve
        before it reads anything. invite-only while we tune it.
      </p>
      <ul className="mt-8 space-y-2">
        {EXAMPLES.map((e) => (
          <li key={e}>
            <button
              type="button"
              onClick={() => onPick(e)}
              className="card-lift w-full border border-line bg-surface px-4 py-3 text-left text-sm text-muted transition-colors hover:text-ink"
            >
              {e}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** clarifying question — option pills + free text, id echoed back to the harness */
function QuestionAsk({
  q,
  busy,
  onAnswer,
}: {
  q: AgentQuestion;
  busy: boolean;
  onAnswer: (questionId: string, answer: string) => void;
}) {
  const [text, setText] = useState("");
  const done = busy;

  function submit(answer: string) {
    const clean = answer.trim();
    if (!clean || done) return;
    onAnswer(q.id, clean);
  }

  return (
    <div className="mt-3 border border-line-strong bg-surface px-4 py-3">
      <p className="text-sm leading-relaxed text-ink">{q.text}</p>
      {q.options && q.options.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {q.options.map((o) => (
            <button
              key={o}
              type="button"
              disabled={done}
              onClick={() => submit(o)}
              className="border border-line px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-40"
            >
              {o}
            </button>
          ))}
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          disabled={done}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit(text);
            }
          }}
          placeholder="or type your own answer…"
          aria-label="your answer"
          className="min-w-0 flex-1 border border-line bg-base px-3 py-2 text-[13px] text-ink outline-none placeholder:text-dim focus:border-line-strong"
        />
        <button
          type="button"
          disabled={done || !text.trim()}
          onClick={() => submit(text)}
          className="border border-line px-3 py-2 font-mono text-[11px] tracking-[0.1em] text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-40"
        >
          reply
        </button>
      </div>
    </div>
  );
}

/* ── thread pieces ──────────────────────────────────────────────────────── */

/** light markdown: links + bold + paragraphs — no html injection */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        const link = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(p);
        if (link) {
          return (
            <a
              key={i}
              href={link[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw text-ink underline decoration-line-strong underline-offset-4"
            >
              {link[1]}
            </a>
          );
        }
        const bold = /^\*\*([^*]+)\*\*$/.exec(p);
        if (bold) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {bold[1]}
            </strong>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function StatusLine({ status }: { status: AgentStatus | null }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.12em] text-dim" aria-live="polite">
      {status ? `${status.phase}${status.detail ? ` — ${status.detail}` : ""}…` : "thinking…"}
    </p>
  );
}

function MessageBlock({
  m,
  busy,
  onAnswer,
  onApprove,
}: {
  m: UiMsg;
  busy: boolean;
  onAnswer: (questionId: string, answer: string) => void;
  onApprove: (queries: string[], urls: string[]) => void;
}) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap border border-line bg-surface px-4 py-2.5 text-sm leading-relaxed text-ink">
          {m.text}
        </p>
      </div>
    );
  }

  return (
    <div className="border-l-2 border-line pl-4">
      {m.text && (
        <div
          className={`whitespace-pre-wrap text-sm leading-relaxed ${m.error ? "text-muted" : "text-[#d9d9d7]"}`}
        >
          <RichText text={m.text} />
        </div>
      )}

      {m.question && <QuestionAsk q={m.question} busy={busy} onAnswer={onAnswer} />}

      {m.plan && (
        <div className="mt-3">
          <PlanCard plan={m.plan} done={m.planDone} busy={busy} onApprove={onApprove} />
        </div>
      )}

      {(m.sources?.length || m.stats) && (
        <div className="mt-3 border-t border-line pt-3">
          {m.sources && m.sources.length > 0 && (
            <ol className="space-y-1">
              {m.sources.map((s, i) => (
                <li key={s.url} className="truncate font-mono text-[11px] leading-snug">
                  <span className="text-dim">[{i + 1}] </span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-draw text-muted hover:text-ink"
                  >
                    {s.title || s.url.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              ))}
            </ol>
          )}
          {m.stats && (
            <p className="mt-2 font-mono text-[10px] tracking-[0.12em] text-dim">
              {m.stats.queries} queries · {m.stats.pages} pages · {(m.stats.ms / 1000).toFixed(1)}s
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const MODES: { id: ChatMode; label: string; hint: string }[] = [
  { id: "chat", label: "chat", hint: "quick answers" },
  { id: "research", label: "research", hint: "search + read" },
  { id: "deep", label: "deep", hint: "slow, thorough" },
];

function Composer({
  email,
  draft,
  setDraft,
  busy,
  mode,
  setMode,
  started,
  onSend,
  onStop,
}: {
  email: string;
  draft: string;
  setDraft: (v: string) => void;
  busy: boolean;
  mode: ChatMode;
  setMode: (m: ChatMode) => void;
  started: boolean;
  onSend: () => void;
  onStop: () => void;
}) {
  return (
    <div className="border-t border-line px-4 pb-4 pt-3 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-end gap-2 border border-line bg-surface px-3 py-2 focus-within:border-line-strong">
          <textarea
            value={draft}
            disabled={busy}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            rows={1}
            placeholder={busy ? "working — esc to stop…" : "ask anything, or paste urls to read…"}
            aria-label="message"
            className="max-h-40 min-h-[2rem] flex-1 resize-none bg-transparent py-1 text-sm text-ink outline-none placeholder:text-dim"
          />
          {busy ? (
            <button
              type="button"
              onClick={onStop}
              className="border border-line px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              stop
            </button>
          ) : (
            <button
              type="button"
              onClick={onSend}
              disabled={!draft.trim()}
              className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#060606] transition-colors hover:bg-[#d8d8d6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              send ➔
            </button>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex gap-1" role="radiogroup" aria-label="research mode">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={mode === m.id}
                title={m.hint}
                disabled={started}
                onClick={() => setMode(m.id)}
                className={`px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] transition-colors ${
                  mode === m.id
                    ? "border border-line-strong text-ink"
                    : "border border-transparent text-dim hover:text-muted"
                } disabled:opacity-50`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="truncate font-mono text-[10px] tracking-[0.1em] text-dim">
            {email} · beta · research can take a minute
          </p>
        </div>
      </div>
    </div>
  );
}

