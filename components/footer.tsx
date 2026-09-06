import Link from "next/link";
import { Logo } from "./logo";
import { BadgePill } from "./badge-pill";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              the universal hybrid agent platform. run routine tasks locally for free —
              offload deep reasoning to the cloud.
            </p>
            <BadgePill dot="bg-local" pulse={false} className="mt-5">
              closed beta · waitlist open
            </BadgePill>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="font-mono text-[11px] tracking-[0.05em] text-dim">product</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/products" className="text-muted transition-colors duration-150 hover:text-ink">aura desktop</Link></li>
                <li><Link href="/products" className="text-muted transition-colors duration-150 hover:text-ink">ramya flow</Link></li>
                <li><Link href="/#waitlist" className="text-muted transition-colors duration-150 hover:text-ink">waitlist</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-[0.05em] text-dim">company</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/#why" className="text-muted transition-colors duration-150 hover:text-ink">why ramya</Link></li>
                <li><Link href="/#architecture" className="text-muted transition-colors duration-150 hover:text-ink">architecture</Link></li>
                <li><Link href="/#vision" className="text-muted transition-colors duration-150 hover:text-ink">vision</Link></li>
                <li><Link href="/admin" className="text-dim transition-colors duration-150 hover:text-ink">admin</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] tracking-[0.05em] text-dim">
            © {year} ramya ai · ramyaai.tech
          </p>
          <p className="font-mono text-[11px] tracking-[0.05em] text-dim">
            designed for the lowercase regime
          </p>
        </div>
      </div>
    </footer>
  );
}
