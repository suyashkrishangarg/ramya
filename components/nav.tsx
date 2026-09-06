"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { PrimaryButton } from "./buttons";

const LINKS = [
  { href: "/", label: "home" },
  { href: "/products", label: "products" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

type NavMember = { name: string | null; position: number } | null;

export function Nav({ member }: { member?: NavMember }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-150 ${
        scrolled || open ? "glass border-b border-line" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="ramya ai — home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`link-draw font-mono text-[11px] tracking-[0.12em] transition-colors duration-150 ${
                isActive(l.href) ? "nav-active" : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {member ? (
            <PrimaryButton href="/profile" className="px-4 py-1.5 text-[13px]">
              profile ➔
            </PrimaryButton>
          ) : (
            <PrimaryButton href="/signup" className="px-4 py-1.5 text-[13px]">
              sign up ➔
            </PrimaryButton>
          )}
        </div>

        <button
          type="button"
          aria-label="menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center border border-line text-ink md:hidden"
        >
          {open ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="glass border-t border-line md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`border-b border-line py-3.5 font-mono text-[12px] tracking-[0.12em] transition-colors duration-150 last:border-0 ${
                  isActive(l.href) ? "nav-active" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {member ? (
              <PrimaryButton href="/profile" className="mt-3">
                profile ➔
              </PrimaryButton>
            ) : (
              <PrimaryButton href="/signup" className="mt-3">
                sign up ➔
              </PrimaryButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
