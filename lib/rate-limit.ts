/**
 * best-effort in-memory rate limiter (per server instance).
 * good enough for a waitlist; swap for upstash redis if abuse becomes a thing.
 */

type Bucket = number[];

const g = globalThis as unknown as { __ramyaRateLimit?: Map<string, Bucket> };
const buckets = (g.__ramyaRateLimit ??= new Map<string, Bucket>());

/** allow `max` events per `windowMs` for a given key */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (bucket.length >= max) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.push(now);
  buckets.set(key, bucket);
  if (buckets.size > 5_000) {
    // prune stale keys occasionally
    for (const [k, b] of buckets) {
      if (b.every((t) => now - t > windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "local"
  );
}
