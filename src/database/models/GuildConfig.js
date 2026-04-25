const { Schema, model } = require('mongoose');

const GuildConfigSchema = new Schema({
  guildId:         { type: String, required: true, unique: true, index: true },
  prefix:          { type: String, default: '.' },
  language:        { type: String, default: 'vi' },
  welcomeChannel:  { type: String, default: null },
  welcomeMessage:  { type: String, default: null },
  leaveChannel:    { type: String, default: null },
  leaveMessage:    { type: String, default: null },
  logChannel:      { type: String, default: null },
  muteRole:        { type: String, default: null },
  autoRole:        { type: String, default: null },
  boostChannel:    { type: String, default: null },
  boostMessage:    { type: String, default: null },
  levelingEnabled: { type: Boolean, default: true },
  levelUpChannel:  { type: String, default: null },
  levelRoles:      { type: Map, of: String, default: new Map() },
  automod:         { type: Schema.Types.Mixed, default: {} },
  ticketCategory:  { type: String, default: null },
  ticketLogChannel:{ type: String, default: null },
  disabledCommands:{ type: [String], default: [] },
  disabledChannels:{ type: [String], default: [] },
}, { timestamps: true });

module.exports = model('GuildConfig', GuildConfigSchema);
