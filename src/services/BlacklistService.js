const BaseService = require('../core/BaseService');
const Blacklist = require('../database/models/Blacklist');
const LRUCache = require('../utils/cache');

class BlacklistService extends BaseService {
  constructor(client) {
    super(client);
    this._cache = new LRUCache(500, 600_000);
  }

  async add(targetId, type, reason, addedBy) {
    await Blacklist.findOneAndUpdate({ targetId }, { targetId, type, reason, addedBy, addedAt: new Date() }, { upsert: true });
    this._cache.set(targetId, true);
  }

  async remove(targetId) {
    await Blacklist.deleteOne({ targetId });
    this._cache.delete(targetId);
  }

  async isBlacklisted(targetId) {
    const cached = this._cache.get(targetId);
    if (cached !== undefined) return cached;
    const entry = await Blacklist.findOne({ targetId });
    const result = !!entry;
    this._cache.set(targetId, result);
    return result;
  }

  async getAll(type) {
    const filter = type ? { type } : {};
    return Blacklist.find(filter).lean();
  }

  async getEntry(targetId) {
    return Blacklist.findOne({ targetId }).lean();
  }
}

module.exports = BlacklistService;
