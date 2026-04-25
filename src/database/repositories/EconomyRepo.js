const Economy = require('../models/Economy');

async function get(userId, guildId) {
  let eco = await Economy.findOne({ userId, guildId });
  if (!eco) {
    eco = await Economy.create({ userId, guildId });
  }
  return eco;
}

async function update(userId, guildId, data) {
  return Economy.findOneAndUpdate(
    { userId, guildId },
    { $set: data },
    { new: true, upsert: true }
  );
}

async function addBalance(userId, guildId, amount, target = 'wallet') {
  const field = target === 'bank' ? 'bank' : 'wallet';
  return Economy.findOneAndUpdate(
    { userId, guildId },
    { $inc: { [field]: amount, totalEarned: amount > 0 ? amount : 0 } },
    { new: true, upsert: true }
  );
}

async function removeBalance(userId, guildId, amount, target = 'wallet') {
  const field = target === 'bank' ? 'bank' : 'wallet';
  return Economy.findOneAndUpdate(
    { userId, guildId },
    { $inc: { [field]: -amount, totalSpent: amount } },
    { new: true, upsert: true }
  );
}

async function transfer(fromUserId, toUserId, guildId, amount) {
  await Economy.findOneAndUpdate(
    { userId: fromUserId, guildId },
    { $inc: { wallet: -amount } },
    { upsert: true }
  );
  return Economy.findOneAndUpdate(
    { userId: toUserId, guildId },
    { $inc: { wallet: amount } },
    { new: true, upsert: true }
  );
}

async function getLeaderboard(guildId, limit = 10) {
  return Economy.find({ guildId })
    .sort({ wallet: -1 })
    .limit(limit)
    .lean();
}

async function remove(userId, guildId) {
  return Economy.deleteOne({ userId, guildId });
}

module.exports = { get, update, addBalance, removeBalance, transfer, getLeaderboard, remove };
