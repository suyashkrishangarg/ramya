import { Section, SectionHeader } from "@/components/section";
import { ListRow } from "@/components/list-row";
import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";

const ROWS = [
  {
    index: "a",
    title: "who faces this",
    body: "anyone using ai daily — developers, researchers, lawyers, accountants, students and power users.",
  },
  {
    index: "b",
    title: "what happens",
    body: "users pay frontier cloud rates for trivial everyday actions, rapidly exhausting their monthly credits.",
  },
  {
    index: "c",
    title: "the pain",
    body: "$20–$50+ per user every month, disruptive rate limits mid-task, and privacy concerns over uploaded files.",
  },
];

export function Problem() {
  return (
    <Section id="why">
      <SectionHeader
        index="01"
        title="the universal token burn"
        sub="agentic ai is transformational — and structured so that the most common actions cost the most."
      />

      <div className="md:col-span-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-10">
            <p className="font-mono text-7xl font-bold leading-none tracking-[-0.03em] text-ink sm:text-8xl">
              <StatCounter to={80} suffix="%" />
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              of agentic ai queries are routine sub-tasks — file search, text
              formatting, summarization. work your own hardware could do for free.
            </p>
          </div>
        </Reveal>

        <div>
          {ROWS.map((row) => (
            <ListRow key={row.index} {...row} />
          ))}
        </div>

        <Reveal>
          <p className="mt-8 font-mono text-[11px] tracking-[0.08em] text-dim">
            frequency → experienced continuously, multiple times every single day.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
