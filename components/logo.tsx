import Image from "next/image";

/**
 * official lockup per designguide.md §2:
 * glyph left of the lowercase wordmark, logo swaps automatically with theme.
 */
export function Logo({
  size = 34,
  wordmark = true,
}: {
  size?: number;
  wordmark?: boolean;
}) {
  return (
    <span className="inline-flex select-none items-center gap-2.5">
      <span
        className="relative inline-block overflow-hidden rounded-[9px] ring-1 ring-line"
        style={{ width: size, height: size }}
      >
        <Image
          src="/ramya_logo_blackbg.png"
          alt="ramya ai"
          width={size}
          height={size}
          className="hidden h-full w-full object-cover dark:block"
        />
        <Image
          src="/ramya_logo_whitebg.png"
          alt="ramya ai"
          width={size}
          height={size}
          className="h-full w-full object-cover dark:hidden"
        />
      </span>
      {wordmark && (
        <span
          className="font-semibold tracking-tight text-ink"
          style={{ fontSize: Math.round(size * 0.5) }}
        >
          ramya ai
        </span>
      )}
    </span>
  );
}
