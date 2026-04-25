const { Schema, model } = require('mongoose');

const BlacklistSchema = new Schema({
  targetId:  { type: String, required: true, unique: true, index: true },
  type:      { type: String, enum: ['user', 'guild'], required: true },
  reason:    { type: String, default: 'No reason' },
  addedBy:   { type: String, required: true },
  addedAt:   { type: Date, default: Date.now },
});

module.exports = model('Blacklist', BlacklistSchema);
