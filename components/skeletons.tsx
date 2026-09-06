/**
 * skeleton (shimmer) primitives — the loading illusion. all markup is
 * aria-hidden: screen readers get the real content when it streams in.
 */

/** single shimmer box — size it with tailwind utilities */
export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

/** fixed header placeholder — same footprint as <Nav /> so there's no jump */
export function NavSkeleton() {
  return (
    <header
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 border-b border-line"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <SkeletonBox className="h-7 w-7 rounded-[7px]" />
          <SkeletonBox className="h-3.5 w-14" />
        </div>
        <div className="hidden items-center gap-7 md:flex">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBox key={i} className="h-3 w-9" />
          ))}
        </div>
        <SkeletonBox className="h-8 w-24 rounded-full" />
      </div>
    </header>
  );
}

/** hero CTA placeholder — a member card + button silhouette */
export function HeroCtaSkeleton() {
  return (
    <div aria-hidden="true" className="mt-10 flex flex-col items-center gap-6">
      <SkeletonBox className="h-16 w-full max-w-md rounded-md" />
      <SkeletonBox className="h-10 w-44 rounded-full" />
    </div>
  );
}

/** full-page skeleton for route transitions (app/loading.tsx) */
export function PageSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-6xl px-5 pb-24 pt-36">
      <SkeletonBox className="mx-auto h-3 w-44 rounded-full" />
      <SkeletonBox className="mx-auto mt-8 h-16 w-3/4 rounded-md" />
      <SkeletonBox className="mx-auto mt-4 h-16 w-1/2 rounded-md" />
      <SkeletonBox className="mx-auto mt-10 h-5 w-full max-w-xl rounded-md" />
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <SkeletonBox className="h-12 w-36 rounded-full" />
        <SkeletonBox className="h-12 w-40 rounded-full" />
      </div>
    </div>
  );
}

/** faq accordion placeholder — used while the (client) section loads */
export function FaqSkeleton() {
  return (
    <div aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="border-t border-line py-5">
          <div className="flex items-center justify-between gap-6">
            <SkeletonBox className="h-4 w-1/2 rounded-sm" />
            <SkeletonBox className="h-4 w-4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** calculator/card placeholder — keeps layout stable while the widget loads */
export function BlockSkeleton({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <SkeletonBox className="h-24 w-full rounded-md" />
    </div>
  );
}