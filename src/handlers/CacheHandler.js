const LRUCache = require('../utils/cache');
const { printBadge } = require('../console/uiLogger');

class CacheHandler {
  constructor(client) {
    this.client = client;
    this._caches = new Map();
  }

  init() {
    this._caches.set('guilds', new LRUCache(500, 300_000));
    this._caches.set('users', new LRUCache(1000, 300_000));
    this._caches.set('economy', new LRUCache(500, 120_000));
    this._caches.set('leveling', new LRUCache(500, 120_000));
    this.client.cache = this;
    printBadge('CACHE', 'In-memory cache initialized', 'cyan', 'green');
  }

  get(namespace) {
    return this._caches.get(namespace);
  }

  create(namespace, maxSize, ttl) {
    const cache = new LRUCache(maxSize, ttl);
    this._caches.set(namespace, cache);
    return cache;
  }

  clearAll() {
    for (const cache of this._caches.values()) {
      cache.clear();
    }
  }

  sweepAll() {
    for (const cache of this._caches.values()) {
      cache.sweep();
    }
  }
}

module.exports = CacheHandler;
