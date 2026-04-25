const { Schema, model } = require('mongoose');

const AFKStatusSchema = new Schema({
  userId:   { type: String, required: true, unique: true, index: true },
  guildId:  { type: String, required: true },
  reason:   { type: String, default: 'AFK' },
  timestamp:{ type: Date, default: Date.now },
});

module.exports = model('AFKStatus', AFKStatusSchema);
