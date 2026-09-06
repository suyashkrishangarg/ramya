"use client";

import { useEffect, useState } from "react";
import { StatCounter } from "@/components/stat-counter";

/**
 * live waitlist counter — pulls the real number from GET /api/waitlist and
 * counts it up on view. degrades to an invitation when the count is zero
 * or the api is unreachable.
 */
export function LiveCounter({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.ok && typeof d.count === "number" && d.count > 0) {
          setCount(d.count);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <p className={className} aria-live="polite">
      {count === null ? (
        "be among the first in line"
      ) : (
        <>
          <StatCounter to={count} className="font-bold text-ink" /> already on
          the list
        </>
      )}
    </p>
  );
}