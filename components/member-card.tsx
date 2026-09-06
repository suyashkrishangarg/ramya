import Link from "next/link";

/** shared signed-in member card — hero, final cta, and profile all reuse it */
export function MemberCard({
  name,
  position,
}: {
  name: string | null;
  position: number;
}) {
  // greet by first name — "welcome back, aditya" reads better than an id
  const first = (name ?? "").trim().split(/\s+/)[0];

  return (
    <div className="w-full max-w-md border border-line-strong bg-surface px-5 py-4">
      <p className="font-mono text-[11px] tracking-[0.12em] text-muted">
        welcome back,
      </p>
      <p className="mt-1 text-3xl font-bold tracking-[-0.02em] text-ink">
        {first || "friend"}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        you&apos;re{" "}
        <span className="font-mono font-bold text-ink">
          #{String(position).padStart(5, "0")}
        </span>{" "}
        in line — we&apos;ll email you when the beta opens.
      </p>
      <Link
        href="/profile"
        className="link-draw mt-3 inline-block font-mono text-[11px] tracking-[0.12em] text-dim transition-colors duration-150 hover:text-ink"
      >
        view profile ➔
      </Link>
    </div>
  );
}