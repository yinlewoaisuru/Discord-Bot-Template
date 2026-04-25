const { Schema, model } = require('mongoose');

const AutomodSchema = new Schema({
  guildId:      { type: String, required: true, unique: true, index: true },
  antispam:     { type: Schema.Types.Mixed, default: { enabled: false, limit: 5, interval: 5000, action: 'mute' } },
  antilink:     { type: Schema.Types.Mixed, default: { enabled: false, whitelist: [], action: 'delete' } },
  antiraid:     { type: Schema.Types.Mixed, default: { enabled: false, joinThreshold: 10, joinInterval: 10000, action: 'kick' } },
  capsFilter:   { type: Schema.Types.Mixed, default: { enabled: false, threshold: 0.7, minLength: 10, action: 'delete' } },
  massMention:  { type: Schema.Types.Mixed, default: { enabled: false, limit: 5, action: 'mute' } },
  badWords:     { type: Schema.Types.Mixed, default: { enabled: false, words: [], action: 'delete' } },
  antiphish:    { type: Schema.Types.Mixed, default: { enabled: false, action: 'ban' } },
  logChannel:   { type: String, default: null },
  exemptRoles:  { type: [String], default: [] },
  exemptChannels: { type: [String], default: [] },
}, { timestamps: true });

module.exports = model('Automod', AutomodSchema);
