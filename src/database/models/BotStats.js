const { Schema, model } = require('mongoose');

const BotStatsSchema = new Schema({
  date:           { type: String, required: true, unique: true, index: true },
  commandsUsed:   { type: Number, default: 0 },
  messagesProcessed: { type: Number, default: 0 },
  guildsJoined:   { type: Number, default: 0 },
  guildsLeft:     { type: Number, default: 0 },
  errorsLogged:   { type: Number, default: 0 },
  commandBreakdown: { type: Map, of: Number, default: new Map() },
}, { timestamps: true });

module.exports = model('BotStats', BotStatsSchema);
