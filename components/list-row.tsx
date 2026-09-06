import type { ReactNode } from "react";

/**
 * hairline list row — the workhorse of the editorial layout.
 * optional mono index, title + body, subtle surface lift on hover.
 */
export function ListRow({
  index,
  title,
  body,
  right,
  className = "",
}: {
  index?: string;
  title: ReactNode;
  body?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group grid gap-2 border-t border-line py-6 transition-colors duration-150 hover:bg-surface sm:grid-cols-[3.5rem_1fr_auto] sm:gap-6 ${className}`}
    >
      {index !== undefined ? (
        <span className="pt-0.5 font-mono text-[11px] tracking-[0.1em] text-dim transition-colors duration-150 group-hover:text-muted">
          {index}
        </span>
      ) : (
        <span className="hidden sm:block" aria-hidden="true" />
      )}
      <div className="min-w-0">
        <h3 className="text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</h3>
        {body && <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>}
      </div>
      {right && <div className="self-center sm:justify-self-end">{right}</div>}
    </div>
  );
}
