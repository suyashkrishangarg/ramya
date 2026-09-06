"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { PrimaryButton } from "./buttons";

const LINKS = [
  { href: "/products", label: "products" },
  { href: "/#why", label: "why ramya" },
  { href: "/#architecture", label: "architecture" },
  { href: "/#vision", label: "vision" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="ramya ai — home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors duration-150 hover:bg-surface hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle />
          <PrimaryButton href="/#waitlist" className="px-4 py-2 text-[13px]">
            join waitlist ➔
          </PrimaryButton>
        </div>

        <button
          type="button"
          aria-label="menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink md:hidden"
        >
          {open ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="glass border-t border-line md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-muted transition-colors duration-150 hover:bg-surface hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
              <ThemeToggle />
              <PrimaryButton href="/#waitlist" className="px-4 py-2 text-[13px]">
                join waitlist ➔
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
