"use client";

import { useCallback, type ReactNode } from "react";

/**
 * cursor-following ambient card glow (designguide.md §6.2) — wraps any card
 * and reveals a radial glow centered on the cursor. sets --mx/--my css vars
 * consumed by the .cursor-glow::before gradient in globals.css.
 */
export function CursorGlow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div className={`cursor-glow ${className}`} onMouseMove={onMove}>
      {children}
    </div>
  );
}