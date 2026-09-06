"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";

type RouterTask = {
  id: string;
  label: string;
  route: "local" | "cloud";
  detail: string;
  latency: string;
  cost: string;
};

const TASKS: RouterTask[] = [
  {
    id: "file",
    label: "find a file on my machine",
    route: "local",
    detail: "file indexing runs entirely on-device",
    latency: "< 50 ms",
    cost: "$0",
  },
  {
    id: "summarize",
    label: "summarize a 40-page pdf",
    route: "local",
    detail: "summarization is routine — the local engine clears it",
    latency: "2 s",
    cost: "$0",
  },
  {
    id: "format",
    label: "reformat this csv",
    route: "local",
    detail: "data formatting is exactly what local is for",
    latency: "< 1 s",
    cost: "$0",
  },
  {
    id: "email",
    label: "draft an email from my notes",
    route: "local",
    detail: "drafting from context you provide needs no cloud",
    latency: "3 s",
    cost: "$0",
  },
  {
    id: "research",
    label: "plan a multi-step research task",
    route: "cloud",
    detail: "deep multi-step reasoning escalates to the cloud mesh",
    latency: "8 s",
    cost: "≈ $0.02 · cost-optimized",
  },
  {
    id: "legal",
    label: "reason through a contract clause",
    route: "cloud",
    detail: "high-stakes reasoning gets the strongest cloud model",
    latency: "12 s",
    cost: "≈ $0.05 · cost-optimized",
  },
];

/**
 * try-the-engine demo — pick a task, watch the hybrid engine route it.
 * fully canned client-side: it demonstrates the concept while the real
 * engine is in development.
 */
export function TaskRouter() {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const task = TASKS[selected];

  return (
    <div>
      {/* task chips */}
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="example tasks">
        {TASKS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={selected === i}
            className={`rounded-full border px-4 py-2 text-[13px] transition-all duration-150 ${
              selected === i
                ? "border-transparent bg-white font-medium text-[#060606]"
                : "border-line text-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* routing strip */}
      <div
        className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border border-line bg-surface px-5 py-4 font-mono text-[11px] tracking-[0.04em] sm:gap-x-4"
        aria-live="polite"
      >
        <span className={task.route ? "text-ink" : "text-muted"}>you give a task</span>
        <span className="text-dim" aria-hidden="true">→</span>
        <span
          className={`transition-colors duration-200 ${
            task.route === "local" ? "font-bold text-ink" : "text-dim"
          }`}
        >
          local engine
        </span>
        <span className="text-dim" aria-hidden="true">→</span>
        <span
          className={`transition-colors duration-200 ${
            task.route === "cloud" ? "font-bold text-ink" : "text-dim"
          }`}
        >
          cloud mesh
        </span>
        <span className="text-dim" aria-hidden="true">→</span>
        <span className="text-ink">done</span>
      </div>

      {/* readout */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={task.id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 border border-line-strong bg-surface px-5 py-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="text-sm leading-relaxed text-muted">
              <span className="font-medium text-ink">
                {task.route === "local" ? "handled on-device" : "escalated to the cloud mesh"}
              </span>{" "}
              — {task.detail}
            </p>
            <div className="flex gap-6 font-mono text-[11px] tracking-[0.08em]">
              <span className="text-dim">
                latency <span className="text-ink">{task.latency}</span>
              </span>
              <span className="text-dim">
                cost <span className="text-ink">{task.cost}</span>
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}