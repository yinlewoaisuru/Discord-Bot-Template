const { Schema, model } = require('mongoose');

const TicketsSchema = new Schema({
  guildId:     { type: String, required: true, index: true },
  channelId:   { type: String, required: true, unique: true },
  userId:      { type: String, required: true },
  ticketId:    { type: String, required: true },
  subject:     { type: String, default: 'No subject' },
  status:      { type: String, enum: ['open', 'closed'], default: 'open' },
  claimedBy:   { type: String, default: null },
  addedUsers:  { type: [String], default: [] },
  closedBy:    { type: String, default: null },
  closedAt:    { type: Date, default: null },
  transcript:  { type: String, default: null },
}, { timestamps: true });

TicketsSchema.index({ guildId: 1, userId: 1, status: 1 });

module.exports = model('Tickets', TicketsSchema);
