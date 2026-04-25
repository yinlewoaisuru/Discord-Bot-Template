const Leveling = require('../models/Leveling');

async function get(userId, guildId) {
  let data = await Leveling.findOne({ userId, guildId });
  if (!data) {
    data = await Leveling.create({ userId, guildId });
  }
  return data;
}

async function addXp(userId, guildId, amount) {
  return Leveling.findOneAndUpdate(
    { userId, guildId },
    {
      $inc: { xp: amount, totalXp: amount, messages: 1 },
      $set: { lastXpAt: new Date() },
    },
    { new: true, upsert: true }
  );
}

async function setLevel(userId, guildId, level, xp = 0) {
  return Leveling.findOneAndUpdate(
    { userId, guildId },
    { $set: { level, xp } },
    { new: true, upsert: true }
  );
}

async function setXp(userId, guildId, xp) {
  return Leveling.findOneAndUpdate(
    { userId, guildId },
    { $set: { xp } },
    { new: true, upsert: true }
  );
}

async function resetXp(userId, guildId) {
  return Leveling.findOneAndUpdate(
    { userId, guildId },
    { $set: { xp: 0, level: 0, totalXp: 0, messages: 0 } },
    { new: true, upsert: true }
  );
}

async function setBoost(userId, guildId, multiplier, duration) {
  return Leveling.findOneAndUpdate(
    { userId, guildId },
    { $set: { xpBoost: multiplier, xpBoostExpiry: new Date(Date.now() + duration) } },
    { new: true, upsert: true }
  );
}

async function getLeaderboard(guildId, limit = 10) {
  return Leveling.find({ guildId })
    .sort({ totalXp: -1 })
    .limit(limit)
    .lean();
}

async function getRank(userId, guildId) {
  const user = await get(userId, guildId);
  const rank = await Leveling.countDocuments({
    guildId,
    totalXp: { $gt: user.totalXp },
  });
  return rank + 1;
}

module.exports = { get, addXp, setLevel, setXp, resetXp, setBoost, getLeaderboard, getRank };
