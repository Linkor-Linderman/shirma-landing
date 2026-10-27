export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
      if (recent.length >= limit) {
        const oldest = recent[0] ?? now;
        const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
        hits.set(key, recent);
        return { ok: false, retryAfterSec };
      }
      recent.push(now);
      hits.set(key, recent);
      return { ok: true };
    },
  };
}

/** 5 попыток за 10 минут с одного IP. Память процесса: на нескольких инстансах лимит независимый. */
export const leadRateLimit = createRateLimiter(5, 10 * 60 * 1000);
