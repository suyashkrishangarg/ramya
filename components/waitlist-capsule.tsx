"use client";

import { useEffect, useRef, useState } from "react";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; position: number; alreadyRegistered: boolean }
  | { state: "error"; message: string };

/** the waitlist input capsule — hairline pill, white on focus, mono feedback */
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
      <div className="w-full max-w-md">
        <div className="border border-line-strong bg-surface px-5 py-4 text-left">
          <p className="font-mono text-[11px] tracking-[0.12em] text-muted">
            {status.alreadyRegistered ? "already on the list" : "you're in"}
          </p>
          <p className="mt-2 font-mono text-3xl font-bold tracking-[-0.02em] text-ink">
            #{String(status.position).padStart(5, "0")}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            we&apos;ll email you when the aura desktop beta opens. your position is
            locked.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={submit}
        noValidate
        className="flex items-center gap-2 border border-line bg-surface p-1.5 pl-4 transition-colors duration-150 focus-within:border-line-strong rounded-full"
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
          className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#060606] transition-colors duration-150 hover:bg-[#d8d8d6] active:scale-[0.98] disabled:opacity-60 sm:px-5"
        >
          {status.state === "loading" ? "joining…" : "join ➔"}
        </button>
      </form>
      {status.state === "error" && (
        <p className="mt-2.5 text-xs text-[#c9c9c7] underline decoration-dotted underline-offset-4">
          {status.message}
        </p>
      )}
      <p className="mt-3 font-mono text-[11px] tracking-[0.05em] text-dim">
        {count === null
          ? "be among the first in line"
          : `${count.toLocaleString("en-US")} already on the list`}{" "}
        · no spam · free during beta
      </p>
    </div>
  );
}
