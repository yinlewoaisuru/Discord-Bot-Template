const { Schema, model } = require('mongoose');

const EconomySchema = new Schema({
  userId:    { type: String, required: true, index: true },
  guildId:   { type: String, required: true, index: true },
  wallet:    { type: Number, default: 0 },
  bank:      { type: Number, default: 0 },
  inventory: { type: [{ itemId: String, name: String, quantity: Number, price: Number }], default: [] },
  lastDaily:   { type: Date, default: null },
  lastWeekly:  { type: Date, default: null },
  lastMonthly: { type: Date, default: null },
  lastWork:    { type: Date, default: null },
  lastCrime:   { type: Date, default: null },
  lastRob:     { type: Date, default: null },
  totalEarned: { type: Number, default: 0 },
  totalSpent:  { type: Number, default: 0 },
  streak:      { type: Number, default: 0 },
}, { timestamps: true });

EconomySchema.index({ userId: 1, guildId: 1 }, { unique: true });
EconomySchema.index({ guildId: 1, wallet: -1 });

module.exports = model('Economy', EconomySchema);
