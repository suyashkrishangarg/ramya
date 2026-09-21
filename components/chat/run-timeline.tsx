"use client";

import type { AgentStatus, RunStats, ToolRow } from "./chat-types";

const PHASE_LABEL: Record<string, string> = {
  thinking: "thinking",
  searching: "searching",
  reading: "reading",
  writing: "writing",
};

/** live run sidebar — phase + every tool call, honest about failures */
export function RunTimeline({
  active,
  status,
  tools,
  stats,
}: {
  active: boolean;
  status: AgentStatus | null;
  tools: ToolRow[];
  stats: RunStats | null;
}) {
  return (
    <div className="flex h-full flex-col">
      <p className="eyebrow px-4 pt-5">run</p>

      <div className="px-4 pt-3">
        {status ? (
          <p className="text-[13px] leading-relaxed text-muted" aria-live="polite">
            <span className="font-mono text-[10px] tracking-[0.15em] text-ink">
              {PHASE_LABEL[status.phase] ?? status.phase}
            </span>
            {status.detail && <span className="block truncate text-dim">{status.detail}</span>}
          </p>
        ) : active ? (
          <p className="text-[13px] text-dim">starting…</p>
        ) : (
          <p className="text-[13px] text-dim">idle</p>
        )}
      </div>

      {tools.length > 0 && (
        <ul className="mt-4 flex-1 space-y-1 overflow-y-auto px-4">
          {tools.map((t, i) => (
            <li
              key={i}
              className="border border-line bg-surface px-2.5 py-2 font-mono text-[11px] leading-snug"
            >
              <span className="tracking-[0.12em] text-dim">
                {t.kind === "search" ? "search" : "read"}
                {t.mandatory ? " · must-read" : ""}
              </span>
              <span className="mt-0.5 block truncate text-muted">
                {t.error ? (
                  <span className="text-muted">✕ {t.error}</span>
                ) : (
                  t.title ?? t.label
                )}
              </span>
              {t.results && t.results.length > 0 && (
                <span className="mt-0.5 block text-dim">{t.results.length} hits</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {stats && (
        <dl className="mt-4 space-y-1.5 border-t border-line px-4 py-4 font-mono text-[10px] tracking-[0.12em] text-dim">
          <div className="flex justify-between">
            <dt>queries</dt>
            <dd className="text-muted">{stats.queries}</dd>
          </div>
          <div className="flex justify-between">
            <dt>pages read</dt>
            <dd className="text-muted">{stats.pages}</dd>
          </div>
          <div className="flex justify-between">
            <dt>took</dt>
            <dd className="text-muted">{(stats.ms / 1000).toFixed(1)}s</dd>
          </div>
          {stats.model && (
            <div className="flex justify-between">
              <dt>model</dt>
              <dd className="max-w-[55%] truncate text-muted">{stats.model}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}
