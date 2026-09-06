import Link from "next/link";
import { Logo } from "@/components/logo";
import { PrimaryButton } from "@/components/buttons";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black_30%,transparent_75%)]" />
      </div>
      <div className="text-center">
        <Logo size={48} wordmark={false} />
        <p className="mt-8 font-mono text-[11px] tracking-[0.18em] text-accent">
          error 404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">
          this page wandered off to the cloud.
        </h1>
        <p className="mt-3 text-sm text-muted">
          the link you followed doesn&apos;t exist — the local engine would have caught
          it for free.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryButton href="/">back to ramya ai ➔</PrimaryButton>
        </div>
        <p className="mt-6 font-mono text-[11px] tracking-[0.05em] text-dim">
          or <Link href="/products" className="transition-colors duration-150 hover:text-muted">explore the products</Link>
        </p>
      </div>
    </main>
  );
}
