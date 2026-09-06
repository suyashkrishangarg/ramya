import Image from "next/image";

/** official lockup — glyph + lowercase wordmark, monochrome tile */
export function Logo({
  size = 30,
  wordmark = true,
}: {
  size?: number;
  wordmark?: boolean;
}) {
  return (
    <span className="inline-flex select-none items-center gap-2.5">
      <span
        className="relative inline-block overflow-hidden rounded-[7px] ring-1 ring-line"
        style={{ width: size, height: size }}
      >
        <Image
          src="/ramya_logo_blackbg.png"
          alt="ramya ai"
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </span>
      {wordmark && (
        <span
          className="font-semibold tracking-tight text-ink"
          style={{ fontSize: Math.round(size * 0.52) }}
        >
          ramya ai
        </span>
      )}
    </span>
  );
}
