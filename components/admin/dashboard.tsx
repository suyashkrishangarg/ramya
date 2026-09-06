"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { BadgePill } from "@/components/badge-pill";
import { StatCounter } from "@/components/stat-counter";
import { SiteLinks } from "./site-links";
import { computeStatsFromMembers } from "./stats";

export type DashboardMember = {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  source: string;
  position: number | null;
  createdAt: string;
  lastSyncedAt: string | null;
  welcomeEmailSentAt: string | null;
};

export function Dashboard({
  adminEmail,
  members,
  sheetsConfigured,
  settings,
}: {
  adminEmail: string;
  members: DashboardMember[];
  sheetsConfigured: boolean;
  settings: Record<string, string>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "google" | "email">("all");
  const [sort, setSort] = useState<"position" | "newest">("position");
  const [syncing, setSyncing] = useState(false);
  const [backfilling, setBackfilling] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const stats = useMemo(() => computeStatsFromMembers(members), [members]);
  const pendingEmails = useMemo(
    () => members.filter((m) => !m.welcomeEmailSentAt).length,
    [members],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = members;
    if (sourceFilter !== "all") rows = rows.filter((m) => m.source === sourceFilter);
    if (q) {
      rows = rows.filter(
        (m) =>
          m.email.toLowerCase().includes(q) ||
          (m.name ?? "").toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) =>
      sort === "position"
        ? (a.position ?? 0) - (b.position ?? 0)
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [members, query, sourceFilter, sort]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 6000);
  }

  async function syncToSheets() {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/sync-sheets", { method: "POST" });
      const data = await res.json();
      flash(
        data.ok
          ? `✓ synced ${data.synced} member${data.synced === 1 ? "" : "s"} to google sheets`
          : `✕ ${data.error ?? "sync failed"}`,
      );
      if (data.ok) router.refresh();
    } catch {
      flash("✕ network error during sync");
    } finally {
      setSyncing(false);
    }
  }

  async function backfillEmails() {
    if (backfilling) return;
    if (
      !window.confirm(
        `send the welcome email to ${pendingEmails} member${pendingEmails === 1 ? "" : "s"} who never received one?\n\nthis uses your resend quota and cannot be undone.`,
      )
    )
      return;
    setBackfilling(true);
    try {
      const res = await fetch("/api/admin/backfill-emails", { method: "POST" });
      const data = await res.json();
      flash(
        data.ok
          ? `✓ welcome email sent to ${data.sent} member${data.sent === 1 ? "" : "s"}${data.failed ? ` · ${data.failed} failed` : ""}`
          : `✕ ${data.error ?? "backfill failed"}`,
      );
      if (data.ok) router.refresh();
    } catch {
      flash("✕ network error during backfill");
    } finally {
      setBackfilling(false);
    }
  }

  async function deleteMember(m: DashboardMember) {
    if (deletingId !== null) return;
    if (
      !window.confirm(
        `delete ${m.email} from the waitlist?\n\nthis removes their position and cannot be undone.`,
      )
    )
      return;
    setDeletingId(m.id);
    try {
      const res = await fetch("/api/admin/delete-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id }),
      });
      const data = await res.json();
      flash(
        data.ok
          ? `✓ deleted ${m.email}`
          : `✕ ${data.error ?? "delete failed"}`,
      );
      if (data.ok) router.refresh();
    } catch {
      flash("✕ network error during delete");
    } finally {
      setDeletingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  function exportCsv() {
    const header = ["position", "email", "name", "source", "joined_at"];
    const escape = (v: unknown) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [header.join(",")];
    for (const m of [...members].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    )) {
      lines.push(
        [m.position, m.email, m.name, m.source, m.createdAt].map(escape).join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ramya-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen flex-1">
      {/* top bar */}
      <header className="glass sticky top-0 z-40 border-b border-line">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5">
          <div className="flex items-center gap-3">
            <Logo size={26} wordmark={false} />
            <div>
              <p className="text-sm font-semibold tracking-[-0.01em] text-ink">
                admin console
              </p>
              <p className="hidden font-mono text-[10px] tracking-[0.05em] text-dim sm:block">
                {adminEmail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCsv}
              className="border border-line px-3.5 py-2 font-mono text-[11px] tracking-[0.03em] text-muted transition-colors duration-150 hover:border-line-strong hover:text-ink"
            >
              export csv
            </button>
            <button
              type="button"
              onClick={backfillEmails}
              disabled={backfilling || pendingEmails === 0}
              title="send the welcome email to members who joined before emails were live"
              className="border border-line px-3.5 py-2 font-mono text-[11px] tracking-[0.03em] text-muted transition-colors duration-150 hover:border-line-strong hover:text-ink disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted"
            >
              {backfilling ? "sending…" : `welcome ${pendingEmails} older signups`}
            </button>
            <button
              type="button"
              onClick={syncToSheets}
              disabled={syncing}
              className="bg-white px-3.5 py-2 font-mono text-[11px] font-semibold text-[#060606] transition-colors duration-150 hover:bg-[#d8d8d6] disabled:opacity-60"
            >
              {syncing ? "syncing…" : sheetsConfigured ? "sync to sheets" : "sync (no url set)"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="border border-line px-3.5 py-2 font-mono text-[11px] tracking-[0.03em] text-muted transition-colors duration-150 hover:border-white/40 hover:text-ink"
            >
              logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* stat cards */}
        <div className="grid border border-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "total members", value: <StatCounter to={stats.total} /> },
            { label: "joined today", value: <StatCounter to={stats.today} /> },
            { label: "last 7 days", value: <StatCounter to={stats.week} /> },
            {
              label: "google · email",
              value: (
                <span className="font-mono text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl">
                  {stats.google}
                  <span className="text-dim"> / </span>
                  {stats.email}
                </span>
              ),
            },
          ].map((card, i) => (
            <div
              key={card.label}
              className={`px-6 py-6 transition-colors duration-150 hover:bg-surface ${
                i > 0 ? "border-t border-line lg:border-l lg:border-t-0" : ""
              } ${i === 1 ? "lg:border-l" : ""}`}
            >
              {card.value}
              <p className="mt-2 font-mono text-[10px] tracking-[0.1em] text-dim">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* site links editor */}
        <div className="mt-6">
          <SiteLinks initial={settings} />
        </div>
        {/* controls */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {(["all", "google", "email"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSourceFilter(s)}
                className={`border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.03em] transition-colors duration-150 ${
                  sourceFilter === s
                    ? "border-white/50 bg-white/10 text-ink"
                    : "border-line text-muted hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "position" | "newest")}
              className="border border-line bg-surface px-3 py-2 font-mono text-[11px] tracking-[0.03em] text-muted outline-none transition-colors duration-150 focus:border-line-strong"
            >
              <option value="position">sort · position</option>
              <option value="newest">sort · newest</option>
            </select>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search email or name…"
              className="w-full border border-line bg-surface px-4 py-2 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-dim focus:border-line-strong sm:w-64"
            />
          </div>
        </div>

        {/* members table */}
        <div className="mt-4 border border-line bg-surface">
          <div className="max-h-[55vh] overflow-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="sticky top-0 bg-elevated">
                <tr className="font-mono text-[10px] tracking-[0.1em] text-dim">
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-5 py-3 font-medium">email</th>
                  <th className="px-5 py-3 font-medium">name</th>
                  <th className="px-5 py-3 font-medium">source</th>
                  <th className="px-5 py-3 font-medium">joined</th>
                  <th className="px-5 py-3 font-medium">sheets</th>
                  <th className="px-5 py-3 font-medium">✕</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="border-t border-line transition-colors duration-150 hover:bg-elevated"
                  >
                    <td className="px-5 py-3 font-mono text-xs font-bold text-ink">
                      {String(m.position ?? 0).padStart(5, "0")}
                    </td>
                    <td className="px-5 py-3 font-mono text-[13px] text-ink">{m.email}</td>
                    <td className="px-5 py-3 text-muted">{m.name ?? "—"}</td>
                    <td className="px-5 py-3">
                      <BadgePill
                        dot={m.source === "google" ? "bg-white" : "bg-dim"}
                        className="border-line"
                      >
                        {m.source}
                      </BadgePill>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted">
                      {new Date(m.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      {m.lastSyncedAt ? (
                        <span className="font-mono text-[11px] text-ink">✓ synced</span>
                      ) : (
                        <span className="font-mono text-[11px] text-dim">· pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteMember(m)}
                        disabled={deletingId !== null}
                        aria-label={`delete ${m.email}`}
                        title={`delete ${m.email}`}
                        className="border border-transparent px-2 py-1 font-mono text-xs text-dim transition-colors duration-150 hover:border-line-strong hover:text-ink disabled:opacity-40"
                      >
                        {deletingId === m.id ? "…" : "✕"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <p className="font-mono text-sm text-dim">
                        {members.length === 0
                          ? "no members yet — share ramyaai.tech and watch this fill up."
                          : "no members match this filter."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-line px-5 py-3">
            <p className="font-mono text-[11px] tracking-[0.03em] text-dim">
              {filtered.length} of {members.length} shown
            </p>
            <p className="font-mono text-[11px] tracking-[0.03em] text-dim">
              {sheetsConfigured
                ? "realtime sheets mirror · active"
                : "sheets mirror not configured — set SHEETS_WEBAPP_URL"}
            </p>
          </div>
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-line-strong bg-elevated px-5 py-3 font-mono text-xs text-ink">
          {toast}
        </div>
      )}
    </main>
  );
}
