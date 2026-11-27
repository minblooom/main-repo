// backend/src/middleware/rateLimit.js
// Lightweight in-memory sliding-window rate limiter for community posting.

export function createRateLimiter({ windowMs = 60_000, max = 20, message = 'Take a gentle breath — too many requests right now.' } = {}) {
  const hits = new Map();

  return (req, res, next) => {
    const key = req.user?.id || req.ip || 'anonymous';
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((ts) => now - ts < windowMs);

    if (recent.length >= max) {
      return res.status(429).json({
        success: false,
        message,
        error: { code: 'RATE_LIMITED', message },
      });
    }

    recent.push(now);
    hits.set(key, recent);
    next();
  };
}
