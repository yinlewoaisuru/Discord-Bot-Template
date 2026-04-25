const BaseService = require('../core/BaseService');
const AFKStatus = require('../database/models/AFKStatus');

class AFKService extends BaseService {
  async set(userId, guildId, reason = 'AFK') {
    return AFKStatus.findOneAndUpdate(
      { userId },
      { userId, guildId, reason, timestamp: new Date() },
      { upsert: true, new: true }
    );
  }

  async get(userId) {
    return AFKStatus.findOne({ userId });
  }

  async remove(userId) {
    return AFKStatus.deleteOne({ userId });
  }

  async isAFK(userId) {
    return !!(await AFKStatus.findOne({ userId }));
  }
}

module.exports = AFKService;
