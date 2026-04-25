const Warnings = require('../models/Warnings');
const { generateId } = require('../../utils/crypto');

async function add(guildId, userId, moderator, reason) {
  const warnId = generateId(8);
  return Warnings.create({ guildId, userId, moderator, reason, warnId });
}

async function getAll(guildId, userId) {
  return Warnings.find({ guildId, userId }).sort({ createdAt: -1 }).lean();
}

async function getById(warnId) {
  return Warnings.findOne({ warnId });
}

async function remove(warnId) {
  return Warnings.deleteOne({ warnId });
}

async function clearAll(guildId, userId) {
  return Warnings.deleteMany({ guildId, userId });
}

async function count(guildId, userId) {
  return Warnings.countDocuments({ guildId, userId });
}

module.exports = { add, getAll, getById, remove, clearAll, count };
