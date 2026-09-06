import { Section, SectionHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";

type Cell = { text: string; bad?: boolean; good?: boolean };

const COLS = ["pure cloud ai", "pure local ai", "ramya hybrid"];

const ROWS: { label: string; cells: [Cell, Cell, Cell] }[] = [
  {
    label: "monthly cost",
    cells: [
      { text: "$20–$50+ per user", bad: true },
      { text: "$0 (your hardware)", good: true },
      { text: "$0 local + low-cost cloud", good: true },
    ],
  },
  {
    label: "privacy",
    cells: [
      { text: "files uploaded to remote servers", bad: true },
      { text: "fully on-device", good: true },
      { text: "sensitive files never leave your machine", good: true },
    ],
  },
  {
    label: "setup",
    cells: [
      { text: "instant", good: true },
      { text: "complex and technical", bad: true },
      { text: "1-click desktop app", good: true },
    ],
  },
  {
    label: "deep reasoning",
    cells: [
      { text: "strong", good: true },
      { text: "weak on consumer hardware", bad: true },
      { text: "strong — cost-optimized cloud mesh", good: true },
    ],
  },
  {
    label: "usage limits",
    cells: [
      { text: "strict caps interrupt work", bad: true },
      { text: "none", good: true },
      { text: "none on local work", good: true },
    ],
  },
];

function CellView({ cell, strong }: { cell: Cell; strong?: boolean }) {
  const mark = cell.bad ? "—" : cell.good ? "+" : "";
  return (
    <span
      className={`text-[13px] leading-relaxed ${
        strong ? "text-ink" : cell.bad ? "text-dim" : "text-muted"
      }`}
    >
      {mark && <span className="mr-1.5 font-mono">{mark}</span>}
      {cell.text}
    </span>
  );
}

export function Gap() {
  return (
    <Section id="gap">
      <SectionHeader
        index="02"
        title="two flawed extremes"
        sub="users worldwide are forced to choose — and neither side actually fits daily work."
      />

      <div className="md:col-span-8">
        <Reveal>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-28 pb-4 pr-4 font-mono text-[10px] font-medium tracking-[0.15em] text-dim">
                    compare
                  </th>
                  {COLS.map((c, i) => (
                    <th
                      key={c}
                      className={`pb-4 pr-4 font-mono text-[10px] font-medium tracking-[0.15em] last:pr-0 ${
                        i === 2 ? "text-ink" : "text-dim"
                      }`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-t border-line transition-colors duration-150 hover:bg-surface">
                    <td className="py-4 pr-4 align-top font-mono text-[11px] tracking-[0.05em] text-muted">
                      {row.label}
                    </td>
                    {row.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={`py-4 pr-4 align-top last:pr-0 ${
                          i === 2 ? "border-x border-line-strong bg-surface/60 px-3" : ""
                        }`}
                      >
                        <CellView cell={cell} strong={i === 2} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 border border-line-strong bg-surface px-6 py-6">
            <p className="font-mono text-[11px] tracking-[0.15em] text-dim">the gap</p>
            <p className="mt-3 max-w-lg text-lg font-medium leading-relaxed tracking-[-0.01em] text-ink">
              no simple desktop app bridges optimized local on-device execution with
              cost-efficient cloud escalation.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-dim">
              today&apos;s workaround: juggling multiple paid subscriptions and copying
              data back and forth. manually.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
