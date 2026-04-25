const BotStats = require('../models/BotStats');

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function increment(field, amount = 1) {
  return BotStats.findOneAndUpdate(
    { date: todayKey() },
    { $inc: { [field]: amount } },
    { new: true, upsert: true }
  );
}

async function incrementCommand(commandName) {
  const key = `commandBreakdown.${commandName}`;
  return BotStats.findOneAndUpdate(
    { date: todayKey() },
    { $inc: { commandsUsed: 1, [key]: 1 } },
    { new: true, upsert: true }
  );
}

async function getToday() {
  let stats = await BotStats.findOne({ date: todayKey() });
  if (!stats) {
    stats = await BotStats.create({ date: todayKey() });
  }
  return stats;
}

async function getRange(days = 7) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return BotStats.find({ date: { $in: dates } }).sort({ date: -1 }).lean();
}

module.exports = { increment, incrementCommand, getToday, getRange };
