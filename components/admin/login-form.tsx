"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "invalid credentials.");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("network error — please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 w-full max-w-sm">
      <label className="block">
        <span className="font-mono text-[11px] tracking-[0.05em] text-dim">email</span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@ramyaai.tech"
          className="mt-2 w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-dim focus:border-accent"
        />
      </label>
      <label className="mt-4 block">
        <span className="font-mono text-[11px] tracking-[0.05em] text-dim">password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          className="mt-2 w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-dim focus:border-accent"
        />
      </label>

      {error && <p className="mt-4 text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-semibold text-[#08090a] transition-all duration-150 hover:opacity-85 active:scale-[0.99] disabled:opacity-60"
      >
        {loading ? "verifying…" : "sign in ➔"}
      </button>
    </form>
  );
}
