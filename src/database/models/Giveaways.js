const { Schema, model } = require('mongoose');

const GiveawaysSchema = new Schema({
  guildId:     { type: String, required: true, index: true },
  channelId:   { type: String, required: true },
  messageId:   { type: String, required: true, unique: true },
  hostId:      { type: String, required: true },
  prize:       { type: String, required: true },
  winners:     { type: Number, default: 1 },
  entries:     { type: [String], default: [] },
  endsAt:      { type: Date, required: true },
  ended:       { type: Boolean, default: false },
  winnerIds:   { type: [String], default: [] },
  requirements:{ type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

GiveawaysSchema.index({ ended: 1, endsAt: 1 });

module.exports = model('Giveaways', GiveawaysSchema);
