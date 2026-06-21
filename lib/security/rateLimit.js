/**
 * Rate Limiter — In-memory sliding window rate limiter for API routes.
 * No external dependencies (Redis/Upstash) — suitable for Vercel serverless.
 * 
 * Usage:
 *   import { rateLimit } from "@/lib/security/rateLimit";
 *   const limiter = rateLimit({ interval: 60_000, maxRequests: 10 });
 *   
 *   // In API route:
 *   const { success } = limiter.check(request);
 *   if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

const tokenBuckets = new Map();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of tokenBuckets.entries()) {
    if (now - bucket.lastRefill > 600_000) {
      tokenBuckets.delete(key);
    }
  }
}, 300_000);

/**
 * Creates a rate limiter instance.
 * @param {Object} options
 * @param {number} options.interval - Time window in ms (default: 60000 = 1 min)
 * @param {number} options.maxRequests - Max requests per window (default: 30)
 * @returns {{ check: (req: Request) => { success: boolean, remaining: number, reset: number } }}
 */
export function rateLimit({ interval = 60_000, maxRequests = 30 } = {}) {
  return {
    check(request) {
      const ip = 
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

      const key = `${ip}`;
      const now = Date.now();
      let bucket = tokenBuckets.get(key);

      if (!bucket || now - bucket.lastRefill > interval) {
        bucket = { tokens: maxRequests, lastRefill: now };
        tokenBuckets.set(key, bucket);
      }

      if (bucket.tokens > 0) {
        bucket.tokens -= 1;
        return {
          success: true,
          remaining: bucket.tokens,
          reset: Math.ceil((bucket.lastRefill + interval - now) / 1000),
        };
      }

      return {
        success: false,
        remaining: 0,
        reset: Math.ceil((bucket.lastRefill + interval - now) / 1000),
      };
    },
  };
}

/**
 * Pre-configured limiters for different route types.
 */
export const authLimiter = rateLimit({ interval: 60_000, maxRequests: 5 });   // 5 auth attempts/min
export const apiLimiter  = rateLimit({ interval: 60_000, maxRequests: 30 });  // 30 API calls/min
export const heavyLimiter = rateLimit({ interval: 60_000, maxRequests: 10 }); // 10 heavy operations/min
