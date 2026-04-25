const { Schema, model } = require('mongoose');

const WarningsSchema = new Schema({
  guildId:    { type: String, required: true, index: true },
  userId:     { type: String, required: true, index: true },
  moderator:  { type: String, required: true },
  reason:     { type: String, default: 'No reason provided' },
  warnId:     { type: String, required: true, unique: true },
  createdAt:  { type: Date, default: Date.now },
});

WarningsSchema.index({ guildId: 1, userId: 1 });

module.exports = model('Warnings', WarningsSchema);
