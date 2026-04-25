const BaseService = require('../core/BaseService');
const LevelingRepo = require('../database/repositories/LevelingRepo');
const config = require('../config/bot.config');
const { randomInt } = require('../utils/formatters');

class LevelingService extends BaseService {
  async processMessage(message) {
    if (!message.guild || message.author.bot) return null;

    const data = await LevelingRepo.get(message.author.id, message.guild.id);

    if (data.lastXpAt && Date.now() - data.lastXpAt.getTime() < config.leveling.xpCooldown * 1000) {
      return null;
    }

    let xpGain = randomInt(config.leveling.xpPerMessage.min, config.leveling.xpPerMessage.max);

    if (data.xpBoost > 1 && data.xpBoostExpiry && data.xpBoostExpiry > new Date()) {
      xpGain = Math.floor(xpGain * data.xpBoost);
    }

    const updated = await LevelingRepo.addXp(message.author.id, message.guild.id, xpGain);
    const requiredXp = config.leveling.xpFormula(updated.level);

    if (updated.xp >= requiredXp) {
      const newLevel = updated.level + 1;
      await LevelingRepo.setLevel(message.author.id, message.guild.id, newLevel, updated.xp - requiredXp);
      this.client.eventBus.emit('levelUp', { userId: message.author.id, guildId: message.guild.id, level: newLevel, channel: message.channel });
      return { levelUp: true, level: newLevel };
    }

    return { levelUp: false };
  }

  async getRank(userId, guildId) {
    const data = await LevelingRepo.get(userId, guildId);
    const rank = await LevelingRepo.getRank(userId, guildId);
    const requiredXp = config.leveling.xpFormula(data.level);
    return { ...data.toObject(), rank, requiredXp };
  }

  async getLeaderboard(guildId, limit = 10) {
    return LevelingRepo.getLeaderboard(guildId, limit);
  }

  async setXp(userId, guildId, xp) {
    return LevelingRepo.setXp(userId, guildId, xp);
  }

  async resetXp(userId, guildId) {
    return LevelingRepo.resetXp(userId, guildId);
  }

  async setBoost(userId, guildId, multiplier, durationMs) {
    return LevelingRepo.setBoost(userId, guildId, multiplier, durationMs);
  }
}

module.exports = LevelingService;
