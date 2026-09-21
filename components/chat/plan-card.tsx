"use client";

import { useState } from "react";
import type { PlanProposal } from "./chat-types";

const URL_RE = /^https?:\/\/[^\s"'<>]+$/i;

/**
 * the plan handshake — proposed queries as an editable checklist plus a
 * must-read url field. approve → re-run with exactly what you confirmed.
 */
export function PlanCard({
  plan,
  done,
  busy,
  onApprove,
}: {
  plan: PlanProposal;
  done?: boolean;
  busy?: boolean;
  onApprove: (queries: string[], urls: string[]) => void;
}) {
  const [checked, setChecked] = useState<boolean[]>(plan.queries.map(() => true));
  const [edits, setEdits] = useState<string[]>(plan.queries);
  const [urlDraft, setUrlDraft] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [urlErr, setUrlErr] = useState<string | null>(null);

  function addUrl() {
    const parts = urlDraft
      .split(/[\s,]+/)
      .map((u) => u.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...urls];
    let bad: string | null = null;
    for (const p of parts) {
      const full = /^https?:\/\//i.test(p) ? p : `https://${p}`;
      if (!URL_RE.test(full) || next.includes(full) || next.length >= 10) {
        bad = p;
        continue;
      }
      next.push(full);
    }
    setUrls(next);
    setUrlDraft("");
    setUrlErr(bad ? `couldn't add "${bad.slice(0, 60)}" — needs a valid site url` : null);
  }

  if (done) {
    return (
      <div className="border border-line bg-surface px-4 py-3">
        <p className="font-mono text-[10px] tracking-[0.2em] text-dim">plan · approved</p>
        <ul className="mt-2 space-y-1">
          {edits.map((q, i) => (
            <li key={i} className="text-sm text-muted">
              {checked[i] ? "› " : "· "}
              {q}
            </li>
          ))}
          {urls.map((u) => (
            <li key={u} className="text-sm text-muted">
              › must-read: <span className="font-mono text-[12px]">{u}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="border border-line-strong bg-surface">
      <div className="border-b border-line px-4 py-2.5">
        <p className="font-mono text-[10px] tracking-[0.2em] text-dim">research plan</p>
        {plan.notes && <p className="mt-1 text-[13px] leading-relaxed text-muted">{plan.notes}</p>}
      </div>
      <PlanBody
        checked={checked}
        setChecked={setChecked}
        edits={edits}
        setEdits={setEdits}
        urlDraft={urlDraft}
        setUrlDraft={setUrlDraft}
        urls={urls}
        setUrls={setUrls}
        urlErr={urlErr}
        setUrlErr={setUrlErr}
        addUrl={addUrl}
        busy={!!busy}
        plan={plan}
        onApprove={onApprove}
      />
    </div>
  );
}

function PlanBody({
  checked,
  setChecked,
  edits,
  setEdits,
  urlDraft,
  setUrlDraft,
  urls,
  setUrls,
  urlErr,
  setUrlErr,
  addUrl,
  busy,
  plan,
  onApprove,
}: {
  checked: boolean[];
  setChecked: React.Dispatch<React.SetStateAction<boolean[]>>;
  edits: string[];
  setEdits: React.Dispatch<React.SetStateAction<string[]>>;
  urlDraft: string;
  setUrlDraft: React.Dispatch<React.SetStateAction<string>>;
  urls: string[];
  setUrls: React.Dispatch<React.SetStateAction<string[]>>;
  urlErr: string | null;
  setUrlErr: React.Dispatch<React.SetStateAction<string | null>>;
  addUrl: () => void;
  busy: boolean;
  plan: PlanProposal;
  onApprove: (queries: string[], urls: string[]) => void;
}) {
  const anyChecked = checked.some(Boolean);

  return (
    <>
      <div className="space-y-1 px-4 py-3">
        {edits.map((q, i) => (
          <label key={i} className="flex cursor-pointer items-start gap-2.5 py-1 text-sm text-ink">
            <input
              type="checkbox"
              checked={checked[i]}
              disabled={busy}
              onChange={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
              className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-white"
            />
            <input
              value={q}
              disabled={busy}
              onChange={(e) => setEdits((qs) => qs.map((v, j) => (j === i ? e.target.value : v)))}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-dim focus:text-white"
              aria-label={`query ${i + 1}`}
            />
          </label>
        ))}
        {edits.length === 0 && (
          <p className="text-sm text-muted">the agent proposed no searches — add urls below.</p>
        )}
      </div>

      <div className="border-t border-line px-4 py-3">

        <label htmlFor="chat-urls" className="font-mono text-[10px] tracking-[0.2em] text-dim">
          must-read urls (always crawled)
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="chat-urls"
            value={urlDraft}
            disabled={busy}
            onChange={(e) => {
              setUrlDraft(e.target.value);
              setUrlErr(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="paste any site — e.g. a doc, a competitor page"
            className="min-w-0 flex-1 border border-line bg-base px-3 py-2 font-mono text-[12px] text-ink outline-none placeholder:text-dim focus:border-line-strong"
          />
          <button
            type="button"
            onClick={addUrl}
            disabled={busy}
            className="border border-line px-3 py-2 font-mono text-[11px] tracking-[0.1em] text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            add
          </button>
        </div>
        {urlErr && <p className="mt-1.5 text-[11px] text-muted">{urlErr}</p>}
        {urls.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {urls.map((u) => (
              <li key={u}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setUrls((l) => l.filter((x) => x !== u))}
                  className="group inline-flex max-w-full items-center gap-1.5 border border-line bg-base px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                  aria-label={`remove ${u}`}
                >
                  <span className="truncate">{u.replace(/^https?:\/\//, "")}</span>
                  <span aria-hidden="true" className="text-dim group-hover:text-ink">
                    ✕
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {plan.question && (
          <p className="mt-3 text-[13px] leading-relaxed text-muted">{plan.question}</p>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-line px-4 py-3">
        <button
          type="button"
          disabled={busy || (!anyChecked && urls.length === 0)}
          onClick={() =>
            onApprove(
              edits.filter((q, i) => checked[i] && q.trim().length >= 3),
              urls,
            )
          }
          className="rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-[#060606] transition-colors hover:bg-[#d8d8d6] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "running…" : "approve & run ➔"}
        </button>
        <p className="font-mono text-[10px] tracking-[0.1em] text-dim">
          {anyChecked
            ? `${checked.filter(Boolean).length} quer${checked.filter(Boolean).length === 1 ? "y" : "ies"}`
            : "no queries"}
          {urls.length > 0 && ` + ${urls.length} url${urls.length === 1 ? "" : "s"}`}
        </p>
      </div>
    </>
  );
}

