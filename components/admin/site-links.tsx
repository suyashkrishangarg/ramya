"use client";

import { useState } from "react";
import { KNOWN_LINKS } from "@/lib/link-keys";

/**
 * site links editor — the admin fills these anytime; the footer renders
 * them automatically. clearing a field removes the link from the site.
 */
export function SiteLinks({ initial }: { initial: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {};
    for (const l of KNOWN_LINKS) seed[l.key] = initial[l.key] ?? "";
    return seed;
  });
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  function set(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setNote(null);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setNote(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: values }),
      });
      const data = await res.json();
      setNote(data.ok ? "✓ links updated — live on the site" : `✕ ${data.error ?? "save failed"}`);
    } catch {
      setNote("✕ network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-[-0.01em] text-ink">site links</h2>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.04em] text-dim">
            rendered in the site footer — leave a field empty to hide it
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-white px-4 py-2 font-mono text-[11px] font-semibold text-[#060606] transition-colors duration-150 hover:bg-[#d8d8d6] disabled:opacity-60"
        >
          {saving ? "saving…" : "save links"}
        </button>
      </div>
      <div className="grid gap-x-8 gap-y-4 px-5 py-5 sm:grid-cols-2">
        {KNOWN_LINKS.map((l) => (
          <label key={l.key} className="block">
            <span className="font-mono text-[10px] tracking-[0.1em] text-dim">{l.label}</span>
            <input
              type="url"
              value={values[l.key] ?? ""}
              onChange={(e) => set(l.key, e.target.value)}
              placeholder="https://…"
              className="mt-1.5 w-full border border-line bg-elevated px-3 py-2 font-mono text-[12px] text-ink outline-none transition-colors duration-150 placeholder:text-dim focus:border-line-strong"
            />
          </label>
        ))}
      </div>
      {note && (
        <p className="border-t border-line px-5 py-3 font-mono text-[11px] text-muted">{note}</p>
      )}
    </div>
  );
}
