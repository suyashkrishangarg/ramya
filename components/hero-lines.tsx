"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * the signature editorial entrance — each headline line sits in an
 * overflow-hidden mask and rises from below, staggered line by line.
 * runs once on mount (heroes are above the fold); reduced-motion users
 * get a clean fade instead.
 */
export function HeroLines({
  lines,
  className = "",
  delay = 0,
  stagger = 0.1,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
          <motion.span
            className="block will-change-transform"
            initial={reduce ? { opacity: 0 } : { y: "112%" }}
            animate={reduce ? { opacity: 1 } : { y: "0%" }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}