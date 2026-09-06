import Link from "next/link";
import { KNOWN_LINKS, getSettings } from "@/lib/settings";

export async function Footer() {
  // settings-driven connect links — nothing renders until set in /admin
  let links: { label: string; url: string }[] = [];
  try {
    const settings = await getSettings();
    links = KNOWN_LINKS.filter((l) => settings[l.key]).map((l) => ({
      label: l.label,
      url: settings[l.key],
    }));
  } catch {
    /* db unavailable — footer degrades gracefully */
  }

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16">
        <p
          aria-hidden="true"
          className="select-none text-[clamp(3.5rem,15vw,11rem)] font-bold leading-[0.85] tracking-[-0.05em] text-ink"
        >
          ramya ai
        </p>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-dim">product</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/products" className="link-draw text-muted transition-colors duration-150 hover:text-ink">aura desktop</Link></li>
              <li><Link href="/products" className="link-draw text-muted transition-colors duration-150 hover:text-ink">ramya flow</Link></li>
              <li><Link href="/#waitlist" className="link-draw text-muted transition-colors duration-150 hover:text-ink">waitlist</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-dim">company</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/about" className="link-draw text-muted transition-colors duration-150 hover:text-ink">about</Link></li>
              <li><Link href="/contact" className="link-draw text-muted transition-colors duration-150 hover:text-ink">contact</Link></li>
              <li><Link href="/products" className="link-draw text-muted transition-colors duration-150 hover:text-ink">the hybrid engine</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-dim">connect</p>
            {links.length > 0 ? (
              <ul className="mt-4 space-y-2.5 text-sm">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw text-muted transition-colors duration-150 hover:text-ink"
                    >
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-dim">
                links coming soon — managed from the admin console.
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-2 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] tracking-[0.05em] text-dim">
            © {new Date().getFullYear()} ramya ai · ramyaai.tech
          </p>
          <p className="font-mono text-[11px] tracking-[0.05em] text-dim">
            local first · cloud when it counts
          </p>
        </div>
      </div>
    </footer>
  );
}
