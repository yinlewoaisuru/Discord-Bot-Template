const UserProfile = require('../models/UserProfile');

async function get(userId) {
  let user = await UserProfile.findOne({ userId });
  if (!user) {
    user = await UserProfile.create({ userId });
  }
  return user;
}

async function update(userId, data) {
  return UserProfile.findOneAndUpdate(
    { userId },
    { $set: data },
    { new: true, upsert: true }
  );
}

async function remove(userId) {
  return UserProfile.deleteOne({ userId });
}

module.exports = { get, update, remove };
