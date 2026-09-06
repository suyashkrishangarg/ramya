import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: ReactNode;
  sub?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent">
        {kicker}
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-[1.2] tracking-[-0.025em] text-ink sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-muted">{sub}</p>}
    </Reveal>
  );
}
