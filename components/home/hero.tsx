import { Reveal } from "@/components/reveal";
import { HeroLines } from "@/components/hero-lines";
import { Glow } from "@/components/glow";
import { PrimaryButton, GhostButton } from "@/components/buttons";
import { MemberCard } from "@/components/member-card";

type HeroProps = {
  member: { name: string | null; position: number } | null;
};

/** vision-first hero — one statement, lots of air, masked line-rise entrance */
export function Hero({ member }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <Glow className="left-1/2 top-[-18%] h-[40rem] w-[40rem] -translate-x-1/2" />
      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-36 text-center sm:pb-32 sm:pt-44">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.2em] text-dim">
            ramya ai · from india
          </p>
        </Reveal>

        <HeroLines
          className="mt-8 text-[12.5vw] font-bold leading-[1.02] tracking-[-0.04em] text-ink sm:text-7xl lg:text-[5.6rem]"
          lines={["ai that's affordable.", "without sacrifices."]}
          delay={0.1}
        />

        <Reveal delay={0.4}>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            routine work should be free. deep reasoning should be cheap. we&apos;re
            building the hybrid engine that makes both true — for the world,
            starting from india.
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          {member ? (
            <div className="mt-10 flex flex-col items-center gap-6">
              <MemberCard name={member.name} position={member.position} />
              <GhostButton href="/products">see the products →</GhostButton>
            </div>
          ) : (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <PrimaryButton href="/signup">join the beta ➔</PrimaryButton>
              <GhostButton href="/products">see the products →</GhostButton>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
