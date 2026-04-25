const GuildConfig = require('../models/GuildConfig');
const LRUCache = require('../../utils/cache');

const cache = new LRUCache(500, 300_000);

async function get(guildId) {
  const cached = cache.get(guildId);
  if (cached) return cached;

  let config = await GuildConfig.findOne({ guildId });
  if (!config) {
    config = await GuildConfig.create({ guildId });
  }
  cache.set(guildId, config);
  return config;
}

async function update(guildId, data) {
  const config = await GuildConfig.findOneAndUpdate(
    { guildId },
    { $set: data },
    { new: true, upsert: true }
  );
  cache.set(guildId, config);
  return config;
}

async function remove(guildId) {
  await GuildConfig.deleteOne({ guildId });
  cache.delete(guildId);
}

function clearCache(guildId) {
  if (guildId) cache.delete(guildId);
  else cache.clear();
}

module.exports = { get, update, remove, clearCache };
