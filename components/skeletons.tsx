/**
 * loading fallbacks for lazily-loaded, below-the-fold widgets only.
 * deliberately quiet: a soft pulse on the page's own surface tone, no
 * glossy shimmer sweep — the widget appears without theatrical flashing.
 */

/** faq accordion placeholder — used while the (client) section loads */
export function FaqSkeleton() {
  return (
    <div aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="border-t border-line py-5">
          <div className="flex items-center justify-between gap-6">
            <div className="skeleton h-4 w-1/2 rounded-sm" />
            <div className="skeleton h-4 w-4 rounded-full" />
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
      <div className="skeleton h-24 w-full rounded-md" />
    </div>
  );
}
