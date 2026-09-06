"use client";

import { useState } from "react";
import { StatCounter } from "@/components/stat-counter";
import { Reveal } from "@/components/reveal";

/**
 * interactive savings estimate — sliders for daily ai usage and current
 * monthly spend produce an animated yearly-savings figure. pure client-side:
 * ~80% of agentic queries are routine (designguide §4), and routine work is
 * free on the local engine, so heavier users save proportionally more.
 */
export function CostCalculator() {
  const [hours, setHours] = useState(3);
  const [spend, setSpend] = useState(25);

  // heavier users have more routine volume to move local — caps at the 80% claim
  const reduction = Math.min(0.8, 0.4 + (hours / 12) * 0.4);
  const yearly = Math.round(spend * 12 * reduction);
  const pct = Math.round(reduction * 100);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow">try the math</p>
              <h2 className="font-display mt-4 text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-3xl">
                what are you overpaying right now?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                move the sliders. the more you use ai, the more of your bill is
                routine work — and routine work is free on the local engine.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <Reveal delay={0.08}>
              <div className="border border-line bg-surface p-7 sm:p-9">
                {/* hours slider */}
                <div>
                  <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.1em] text-muted">
                    <span>daily ai usage</span>
                    <span className="text-ink">{hours.toFixed(1)} h / day</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={12}
                    step={0.5}
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    aria-label="hours of ai use per day"
                    className="mt-4 w-full accent-white"
                  />
                </div>

                {/* spend slider */}
                <div className="mt-8">
                  <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.1em] text-muted">
                    <span>current monthly ai spend</span>
                    <span className="text-ink">${spend} / mo</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={spend}
                    onChange={(e) => setSpend(Number(e.target.value))}
                    aria-label="current monthly ai spend in dollars"
                    className="mt-4 w-full accent-white"
                  />
                </div>

                {/* output */}
                <div className="mt-10 border-t border-line pt-8">
                  <p className="font-mono text-[11px] tracking-[0.15em] text-dim">
                    estimated yearly savings with ramya
                  </p>
                  <p className="mt-2 font-mono text-6xl font-bold tracking-[-0.03em] text-ink sm:text-7xl">
                    <StatCounter to={yearly} prefix="$" key={`${yearly}`} />
                  </p>
                  <p className="mt-4 font-mono text-[11px] tracking-[0.05em] text-muted">
                    ≈ {pct}% of your current ai bill —{" "}
                    <span className="text-ink">routine work runs local, free.</span>
                  </p>
                  <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-[0.03em] text-dim">
                    rough estimate — actual savings depend on your task mix.
                    deep reasoning still touches the cloud, just optimized.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}