import Link from "next/link";
import { Logo } from "@/components/logo";
import { PrimaryButton } from "@/components/buttons";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-1 items-center px-5">
      <div className="mx-auto w-full max-w-6xl">
        <Logo />
        <p className="mt-10 font-mono text-[11px] tracking-[0.2em] text-dim">error 404</p>
        <h1 className="mt-4 text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-7xl">
          this page wandered
          <br />
          <span className="outline-text">off to the cloud.</span>
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
          the link you followed doesn&apos;t exist — the local engine would have caught
          it for free.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href="/">back to ramya ai ➔</PrimaryButton>
          <Link
            href="/products"
            className="inline-flex items-center rounded-full border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-white hover:text-[#060606]"
          >
            explore the products
          </Link>
        </div>
      </div>
    </main>
  );
}
