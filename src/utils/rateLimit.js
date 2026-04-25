const { RATE_LIMIT_WINDOW } = require('../config/constants.config');

class RateLimitTracker {
  constructor() {
    this._limits = new Map();
  }

  check(key, maxHits, windowMs = RATE_LIMIT_WINDOW) {
    const now = Date.now();
    const entry = this._limits.get(key);

    if (!entry || now > entry.resetAt) {
      this._limits.set(key, { hits: 1, resetAt: now + windowMs });
      return { limited: false, remaining: maxHits - 1, resetIn: windowMs };
    }

    entry.hits++;
    const remaining = Math.max(0, maxHits - entry.hits);
    const resetIn = entry.resetAt - now;

    if (entry.hits > maxHits) {
      return { limited: true, remaining: 0, resetIn };
    }

    return { limited: false, remaining, resetIn };
  }

  reset(key) {
    this._limits.delete(key);
  }

  sweep() {
    const now = Date.now();
    for (const [key, entry] of this._limits) {
      if (now > entry.resetAt) this._limits.delete(key);
    }
  }

  clear() {
    this._limits.clear();
  }
}

module.exports = RateLimitTracker;
