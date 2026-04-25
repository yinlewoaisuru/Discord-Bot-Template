const { Schema, model } = require('mongoose');

const LevelingSchema = new Schema({
  userId:   { type: String, required: true, index: true },
  guildId:  { type: String, required: true, index: true },
  xp:       { type: Number, default: 0 },
  level:    { type: Number, default: 0 },
  totalXp:  { type: Number, default: 0 },
  messages: { type: Number, default: 0 },
  lastXpAt: { type: Date, default: null },
  xpBoost:  { type: Number, default: 1 },
  xpBoostExpiry: { type: Date, default: null },
}, { timestamps: true });

LevelingSchema.index({ userId: 1, guildId: 1 }, { unique: true });
LevelingSchema.index({ guildId: 1, totalXp: -1 });

module.exports = model('Leveling', LevelingSchema);
