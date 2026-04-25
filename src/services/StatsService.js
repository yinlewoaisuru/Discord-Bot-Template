const BaseService = require('../core/BaseService');
const StatsRepo = require('../database/repositories/StatsRepo');
const { isConnected } = require('../database/connection');
const logger = require('../utils/logger');

class StatsService extends BaseService {
  async trackCommand(commandName) {
    if (!isConnected()) return null;
    try {
      return await StatsRepo.incrementCommand(commandName);
    } catch (err) {
      logger.debug('[StatsService] trackCommand failed:', err.message);
      return null;
    }
  }

  async trackMessage() {
    if (!isConnected()) return null;
    try {
      return await StatsRepo.increment('messagesProcessed');
    } catch (err) {
      logger.debug('[StatsService] trackMessage failed:', err.message);
      return null;
    }
  }

  async trackGuildJoin() {
    if (!isConnected()) return null;
    try {
      return await StatsRepo.increment('guildsJoined');
    } catch (err) {
      logger.debug('[StatsService] trackGuildJoin failed:', err.message);
      return null;
    }
  }

  async trackGuildLeave() {
    if (!isConnected()) return null;
    try {
      return await StatsRepo.increment('guildsLeft');
    } catch (err) {
      logger.debug('[StatsService] trackGuildLeave failed:', err.message);
      return null;
    }
  }

  async trackError() {
    if (!isConnected()) return null;
    try {
      return await StatsRepo.increment('errorsLogged');
    } catch (err) {
      logger.debug('[StatsService] trackError failed:', err.message);
      return null;
    }
  }

  async getToday() {
    if (!isConnected()) return null;
    try {
      return await StatsRepo.getToday();
    } catch (err) {
      logger.debug('[StatsService] getToday failed:', err.message);
      return null;
    }
  }

  async getWeekly() {
    if (!isConnected()) return [];
    try {
      return await StatsRepo.getRange(7);
    } catch (err) {
      logger.debug('[StatsService] getWeekly failed:', err.message);
      return [];
    }
  }

  getSystemStats() {
    const mem = process.memoryUsage();
    return {
      uptime: this.client.uptime,
      memory: {
        rss: Math.round(mem.rss / 1024 / 1024),
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      },
      guilds: this.client.guilds.cache.size,
      users: this.client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0), 0),
      channels: this.client.channels.cache.size,
      commands: this.client.commands.size,
      slashCommands: this.client.slash.size,
      nodeVersion: process.version,
      platform: process.platform,
    };
  }
}

module.exports = StatsService;
