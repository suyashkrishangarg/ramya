import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/**
 * editorial section header — mono index + title pinned left, content
 * flows in the right column (label-left / content-right asymmetric grid).
 */
export function SectionHeader({
  index,
  title,
  sub,
}: {
  index: string;
  title: ReactNode;
  sub?: string;
}) {
  return (
    <div className="md:col-span-4">
      <Reveal>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] tracking-[0.2em] text-dim">{index}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        </div>
        <h2 className="font-display mt-4 text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-3xl">
          {title}
        </h2>
        {sub && <p className="mt-4 text-sm leading-relaxed text-muted">{sub}</p>}
      </Reveal>
    </div>
  );
}

/** the standard section shell — hairline top border + asymmetric grid */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`border-t border-line ${className}`}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="grid gap-12 md:grid-cols-12">{children}</div>
      </div>
    </section>
  );
}
