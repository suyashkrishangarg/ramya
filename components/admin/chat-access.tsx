"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ChatRow = { email: string; grantedAt: string | null };

/**
 * chat beta access manager (admin console) — lists grants and lets you add
 * emails by hand. the members table's per-row "+ chat" buttons share the same
 * grant/revoke state, so both stay in sync.
 */
export function ChatAccess({
  rows,
  busy,
  onGrant,
  onRevoke,
}: {
  rows: ChatRow[];
  busy: boolean;
  onGrant: (email: string) => Promise<{ ok: boolean; error?: string }>;
  onRevoke: (email: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(null), 6000);
  }

  async function grant() {
    const clean = draft.trim().toLowerCase();
    if (!clean || busy) return;
    if (!EMAIL_RE.test(clean)) {
      flash("✕ that doesn't look like an email");
      return;
    }
    if (rows.some((r) => r.email === clean)) {
      flash("✕ already on the list");
      return;
    }
    const res = await onGrant(clean);
    if (res.ok) setDraft("");
    else flash(`✕ ${res.error ?? "grant failed"}`);
  }

  async function revoke(email: string) {
    if (busy) return;
    const res = await onRevoke(email);
    if (!res.ok) flash(`✕ ${res.error ?? "revoke failed"}`);
  }

  return (
    <section className="border border-line">
      <div className="flex items-baseline justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-[-0.01em] text-ink">chat beta access</h2>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.05em] text-dim">
            who can open /chat · grant from the members table or below · env CHAT_BETA_EMAILS grants on top
          </p>
        </div>
        <p className="font-mono text-[11px] text-dim">{rows.length} granted</p>
      </div>

      <div className="flex gap-2 px-5 py-4">
        <input
          type="email"
          value={draft}
          disabled={busy}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void grant();
            }
          }}
          placeholder="email to grant, e.g. tester@domain.com"
          aria-label="email to grant chat access"
          className="min-w-0 flex-1 border border-line bg-surface px-3 py-2 font-mono text-[12px] text-ink outline-none transition-colors duration-150 placeholder:text-dim focus:border-line-strong"
        />
        <button
          type="button"
          onClick={() => void grant()}
          disabled={busy || !draft.trim()}
          className="bg-white px-3.5 py-2 font-mono text-[11px] font-semibold text-[#060606] transition-colors duration-150 hover:bg-[#d8d8d6] disabled:opacity-60"
        >
          {busy ? "…" : "grant"}
        </button>
      </div>

      {msg && <p className="px-5 pb-3 font-mono text-[11px] text-muted">{msg}</p>}

      {rows.length > 0 && (
        <ul className="border-t border-line">
          {rows.map((r) => (
            <li
              key={r.email}
              className="flex items-center justify-between gap-3 border-b border-line px-5 py-2.5 last:border-b-0 transition-colors duration-150 hover:bg-elevated"
            >
              <span className="truncate font-mono text-[12px] text-ink">{r.email}</span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-[10px] text-dim">
                  {r.grantedAt
                    ? new Date(r.grantedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })
                    : ""}
                </span>
                <button
                  type="button"
                  onClick={() => void revoke(r.email)}
                  disabled={busy}
                  aria-label={`revoke ${r.email}`}
                  className="border border-transparent px-2 py-1 font-mono text-xs text-dim transition-colors duration-150 hover:border-line-strong hover:text-ink disabled:opacity-40"
                >
                  ✕
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
