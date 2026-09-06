"use client";

import { useCallback, type MouseEvent, type ReactNode } from "react";

/**
 * card + containers per designguide.md §6.2:
 * 1px subtle stroke, 16px radius, ambient radial glow that follows the cursor.
 */
export function GlowCard({
  children,
  className = "",
  accent = false,
  radius = "rounded-2xl",
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
  radius?: string;
}) {
  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div
      onMouseMove={onMove}
      className={`group relative overflow-hidden border bg-surface transition-colors duration-150 ${
        accent
          ? "border-accent/40 shadow-[0_0_40px_-18px_var(--accent)]"
          : "border-line hover:border-accent/30"
      } ${radius} ${className}`}
    >
      <div className="glow-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  );
}
