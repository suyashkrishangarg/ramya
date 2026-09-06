const ITEMS = [
  "aura desktop — beta waitlist open",
  "local inference — $0",
  "cloud reasoning — up to 80% cheaper",
  "bring your own key",
  "ramya flow — video & animation · in idea",
  "private by design",
];

/** slow monochrome ticker — pauses on hover */
export function Marquee() {
  const row = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span
          key={item}
          className="flex items-center whitespace-nowrap font-mono text-[11px] tracking-[0.15em] text-dim"
        >
          <span className="px-6">{item}</span>
          <span className="text-line-strong" aria-hidden="true">
            {"//"}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee overflow-hidden border-y border-line py-3.5">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
