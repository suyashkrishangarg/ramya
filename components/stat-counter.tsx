"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

/** mono metric that counts up when scrolled into view (designguide.md §4.2) */
export function StatCounter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${v.toLocaleString("en-US", {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals,
          })}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
}
