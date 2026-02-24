/**
 * In-Memory Sliding Window Rate Limiter
 *
 * Works per-process (Node.js runtime, not Edge).
 * Good enough for a single-instance Next.js server.
 * Upgrade to @upstash/ratelimit for multi-instance / Vercel deployments.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

/** Clean up expired entries every 5 minutes to avoid memory leaks */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    // Keep entries only within the last hour
    if (now - entry.windowStart > 60 * 60 * 1000) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // epoch ms when the window resets
}

/**
 * Check rate limit for a given key (e.g. IP address).
 * @param key     Unique identifier (IP, userId, etc.)
 * @param limit   Max requests allowed in the window
 * @param windowMs  Window duration in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    // Start a new window
    store.set(key, { count: 1, windowStart: now });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.windowStart + windowMs,
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.windowStart + windowMs,
  };
}

/** Helper to extract the real IP from Next.js request headers */
export function getIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
