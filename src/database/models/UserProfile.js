const { Schema, model } = require('mongoose');

const UserProfileSchema = new Schema({
  userId:     { type: String, required: true, unique: true, index: true },
  username:   { type: String, default: '' },
  bio:        { type: String, default: '' },
  badges:     { type: [String], default: [] },
  reputation: { type: Number, default: 0 },
  language:   { type: String, default: 'vi' },
  premium:    { type: Boolean, default: false },
  premiumExpiry: { type: Date, default: null },
}, { timestamps: true });

module.exports = model('UserProfile', UserProfileSchema);
