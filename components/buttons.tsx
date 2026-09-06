import Link from "next/link";
import type { ReactNode } from "react";

const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#08090a] transition-all duration-150 hover:opacity-85 hover:shadow-[0_0_28px_-6px_var(--accent)] active:scale-[0.98]";

const GHOST =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-150 hover:border-accent/50 hover:bg-elevated active:scale-[0.98]";

export function PrimaryButton({
  href,
  children,
  className = "",
  type,
  disabled,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const cls = `${PRIMARY} ${disabled ? "pointer-events-none opacity-60" : ""} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function GhostButton({
  href,
  children,
  className = "",
  type,
  disabled,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const cls = `${GHOST} ${disabled ? "pointer-events-none opacity-60" : ""} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
