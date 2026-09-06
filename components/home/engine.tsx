import { Section, SectionHeader } from "@/components/section";
import { ListRow } from "@/components/list-row";
import { Reveal } from "@/components/reveal";

const ROWS = [
  {
    index: "01",
    title: "1-click desktop app",
    body: "clean, zero-code interface for both technical and non-technical users. no cli. no config files. install and go.",
  },
  {
    index: "02",
    title: "free & private local engine",
    body: "file searches, text summaries, data formatting and routine sub-tasks execute directly on your device. 100% free, 100% private.",
  },
  {
    index: "03",
    title: "cost-optimized cloud mesh",
    body: "complex multi-step reasoning offloads seamlessly to fine-tuned, high-intelligence cloud models.",
  },
  {
    index: "04",
    title: "user choice & flexibility",
    body: "local inference is 100% free. pay only for cloud power at up to 80% lower cost — with bring-your-own-key support.",
  },
];

export function Engine() {
  return (
    <Section id="engine">
      <SectionHeader
        index="03"
        title="the ramya hybrid architecture"
        sub="a universal, zero-friction desktop ai engine. install once — it just works."
      />

      <div className="md:col-span-8">
        <div>
          {ROWS.map((row) => (
            <ListRow key={row.index} {...row} />
          ))}
        </div>

        <Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border border-line bg-surface px-5 py-4 font-mono text-[11px] tracking-[0.04em] text-muted sm:gap-x-4">
            <span className="text-ink">you give a task</span>
            <span className="text-dim">→</span>
            <span>local engine clears the routine</span>
            <span className="text-dim">→</span>
            <span>cloud mesh clears the deep</span>
            <span className="text-dim">→</span>
            <span className="text-ink">done</span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
