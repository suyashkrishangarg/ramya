"use client";

import { useEffect, useRef, useState } from "react";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; position: number; alreadyRegistered: boolean }
  | { state: "error"; message: string };

/**
 * the waitlist input capsule per designguide.md §6.1:
 * single pill container, hairline border → electric cyan on focus.
 */
export function WaitlistCapsule() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [count, setCount] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.ok && typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status.state === "loading") return;
    setStatus({ state: "loading" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: honeypot.current?.value ?? "" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus({ state: "error", message: data.error ?? "something went wrong." });
        return;
      }
      setStatus({
        state: "success",
        position: data.position,
        alreadyRegistered: data.alreadyRegistered,
      });
      if (typeof data.count === "number") setCount(data.count);
    } catch {
      setStatus({ state: "error", message: "network error — please try again." });
    }
  }

  if (status.state === "success") {
    return (
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-4 rounded-2xl border border-local/40 bg-surface px-5 py-4 text-left">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-local/15 text-local">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">
              {status.alreadyRegistered
                ? "you're already on the list — even better."
                : "you're on the list. welcome aboard."}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted">
              position{" "}
              <span className="font-bold text-local">
                #{String(status.position).padStart(5, "0")}
              </span>{" "}
              · we&apos;ll email you when the aura desktop beta opens.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={submit}
        noValidate
        className="flex items-center gap-2 rounded-full border border-line bg-surface p-1.5 pl-5 transition-colors duration-150 focus-within:border-accent sm:p-2 sm:pl-6"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status.state === "error") setStatus({ state: "idle" });
          }}
          placeholder="enter your email address..."
          aria-label="email address"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-dim"
        />
        {/* honeypot — humans never see or fill this */}
        <input
          ref={honeypot}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={status.state === "loading"}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#08090a] transition-all duration-150 hover:opacity-85 active:scale-[0.98] disabled:opacity-60 sm:px-5"
        >
          {status.state === "loading" ? "joining…" : "join ➔"}
        </button>
      </form>
      {status.state === "error" && (
        <p className="mt-2.5 text-xs text-red-500">{status.message}</p>
      )}
      <p className="mt-3 font-mono text-[11px] tracking-[0.05em] text-dim">
        {count === null
          ? "be among the first in line"
          : `${count.toLocaleString("en-US")} already on the list`}{" "}
        · free during beta · no spam
      </p>
    </div>
  );
}
