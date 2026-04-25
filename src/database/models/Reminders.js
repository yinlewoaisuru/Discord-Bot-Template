const { Schema, model } = require('mongoose');

const RemindersSchema = new Schema({
  userId:    { type: String, required: true, index: true },
  channelId: { type: String, required: true },
  guildId:   { type: String, default: null },
  message:   { type: String, required: true },
  remindAt:  { type: Date, required: true, index: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

RemindersSchema.index({ completed: 1, remindAt: 1 });

module.exports = model('Reminders', RemindersSchema);
