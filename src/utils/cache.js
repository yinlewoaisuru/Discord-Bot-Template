const { CACHE_DEFAULT_TTL, CACHE_MAX_SIZE } = require('../config/constants.config');

class LRUCache {
  constructor(maxSize = CACHE_MAX_SIZE, ttl = CACHE_DEFAULT_TTL) {
    this._maxSize = maxSize;
    this._ttl = ttl;
    this._cache = new Map();
  }

  get(key) {
    const entry = this._cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiry) {
      this._cache.delete(key);
      return undefined;
    }
    this._cache.delete(key);
    this._cache.set(key, entry);
    return entry.value;
  }

  set(key, value, ttl) {
    if (this._cache.has(key)) this._cache.delete(key);
    if (this._cache.size >= this._maxSize) {
      const firstKey = this._cache.keys().next().value;
      this._cache.delete(firstKey);
    }
    this._cache.set(key, {
      value,
      expiry: Date.now() + (ttl ?? this._ttl),
    });
    return this;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    return this._cache.delete(key);
  }

  clear() {
    this._cache.clear();
  }

  get size() {
    return this._cache.size;
  }

  sweep() {
    const now = Date.now();
    for (const [key, entry] of this._cache) {
      if (now > entry.expiry) this._cache.delete(key);
    }
  }
}

module.exports = LRUCache;
