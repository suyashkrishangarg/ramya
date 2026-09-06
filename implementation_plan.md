# Implementation Plan - ramya ai - website v2

## Overview

Evolve the v1 landing pages into a more interactive, characterful, and internally
consistent website - without breaking the monochrome identity, the waitlist funnel,
or any existing auth/admin/email infrastructure.

Scope: typography overhaul (distinctive display font, incl. an attempt to source the
font behind the logos r glyph), a design-consistency pass (shared type/spacing tokens,
unified eyebrow/card treatments), and three interactive pieces (FAQ accordion + live
waitlist counter, a cost-savings calculator, a task-router demo). All client-side -
no new backend, no new dependencies.

Context: Next.js 16 + Tailwind 4 (@theme tokens in globals.css) + motion/react
(Reveal, HeroLines, StatCounter, card-lift, glow already exist). Fonts load via
next/font/google in layout.tsx. Locked decisions: FULLY MONOCHROME (brand-guide
cyan/emerald/violet stays OFF); MVP ships in ~2 months, so v2 must sell the concept
interactively.

## Types (client-side only)

- RouterTask = { id, label, route: local | cloud, detail, latency, cost }
- FaqItem = { q, a }
- CalcState = { hoursPerDay, currentSpend } - yearly savings =
  hoursPerDay x 22 days x reductionPct x (currentSpend x 12), reduction 40-80%

## Files

New:
- components/faq.tsx - accordion (motion height animation, one-open-at-a-time)
- components/cost-calculator.tsx - two sliders -> animated yearly-savings output
- components/task-router.tsx - try-the-engine demo: task chips -> animated
  local-vs-cloud routing with latency/cost readout
- components/live-counter.tsx - fetches GET /api/waitlist -> count-up line
- components/scroll-progress.tsx - 2px top progress bar (motion useScroll)
- app/template.tsx - subtle fade+rise page transitions
- components/cursor-glow.tsx - cursor-following radial glow card wrapper (designguide 6.2)

Modified:
- app/layout.tsx - load Space Grotesk via next/font/google (--font-space-grotesk);
  logo font via next/font/local later if licensed
- app/globals.css - type-scale tokens, .font-display + .eyebrow utilities,
  .cursor-glow effect, --font-display in @theme
- app/page.tsx - FAQ + calculator sections; LiveCounter into CtaBand
- app/signup/page.tsx - LiveCounter under the capsule
- app/products/page.tsx - TaskRouter inside aura hybrid-engine block
- app/about/page.tsx, components/nav.tsx, components/home/hero.tsx - font-display
  + eyebrow adoption; ScrollProgress mounted in nav

Deleted: components/home/final-cta.tsx already gone; nothing else.

## Functions

New: Faq({items}), CostCalculator(), TaskRouter(), LiveCounter(), ScrollProgress(),
CursorGlow({children, className}). Modified: RootLayout (font vars), CtaBand
(counter line). Removed: none.

## Dependencies

None added. Font sourcing risk: Canva fonts cannot be extracted; candidate is
Artificial Intelligence by weknow (dafont) - often PERSONAL-USE-ONLY license, which
would rule it out for a commercial site. Fallback (chosen): Space Grotesk display
font. Nothing blocks on this.

## Testing

tsc + build per phase (rerun tsc after build for stale .next/types); live curl smoke
tests; manual interaction checks (accordion, sliders, chips, counter, reduced-motion);
invariants: member redirects, admin login, welcome-email skip log.

## Implementation Order (each step = 1 commit = 1 Vercel deploy)

1. Typography - Space Grotesk display font + type-scale tokens on heroes/H2s
2. Consistency pass - .eyebrow utility, spacing, cursor-glow cards
3. FAQ accordion + live waitlist counter (homepage + signup)
4. Cost-savings calculator (homepage)
5. Task-router demo (products / aura section)
6. Scroll progress + page transitions
