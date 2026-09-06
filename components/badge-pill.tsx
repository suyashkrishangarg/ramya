import type { ReactNode } from "react";

/** mono status tag with an optional indicator dot — monochrome by default */
export function BadgePill({
  children,
  dot = "bg-white",
  pulse = false,
  className = "",
}: {
  children: ReactNode;
  dot?: string | null;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 border border-line px-3 py-1 font-mono text-[11px] font-medium tracking-[0.05em] text-muted ${className}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dot} ${pulse ? "animate-pulse" : ""}`} />
      )}
      {children}
    </span>
  );
}
