const BaseService = require('../core/BaseService');
const ModerationRepo = require('../database/repositories/ModerationRepo');
const { createModEmbed } = require('../utils/embedBuilder');
const { canModerate } = require('../utils/permCheck');
const logger = require('../utils/logger');

class ModerationService extends BaseService {
  async ban(guild, target, moderator, reason = 'No reason', days = 0) {
    const modCheck = canModerate(moderator, target, guild.members.me);
    if (!modCheck.can) return { success: false, error: modCheck.reason };

    try {
      await target.ban({ deleteMessageDays: days, reason: `${moderator.user.tag}: ${reason}` });
      this.client.eventBus.emit('modAction', { action: 'ban', guild, target: target.user, moderator: moderator.user, reason });
      return { success: true };
    } catch (err) {
      logger.error('[ModerationService] Ban failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  async unban(guild, userId, moderator, reason = 'No reason') {
    try {
      await guild.bans.remove(userId, `${moderator.user.tag}: ${reason}`);
      this.client.eventBus.emit('modAction', { action: 'unban', guild, targetId: userId, moderator: moderator.user, reason });
      return { success: true };
    } catch (err) {
      logger.error('[ModerationService] Unban failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  async kick(guild, target, moderator, reason = 'No reason') {
    const modCheck = canModerate(moderator, target, guild.members.me);
    if (!modCheck.can) return { success: false, error: modCheck.reason };

    try {
      await target.kick(`${moderator.user.tag}: ${reason}`);
      this.client.eventBus.emit('modAction', { action: 'kick', guild, target: target.user, moderator: moderator.user, reason });
      return { success: true };
    } catch (err) {
      logger.error('[ModerationService] Kick failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  async timeout(guild, target, moderator, duration, reason = 'No reason') {
    const modCheck = canModerate(moderator, target, guild.members.me);
    if (!modCheck.can) return { success: false, error: modCheck.reason };

    try {
      await target.timeout(duration, `${moderator.user.tag}: ${reason}`);
      this.client.eventBus.emit('modAction', { action: 'timeout', guild, target: target.user, moderator: moderator.user, reason, duration });
      return { success: true };
    } catch (err) {
      logger.error('[ModerationService] Timeout failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  async untimeout(guild, target, moderator, reason = 'No reason') {
    try {
      await target.timeout(null, `${moderator.user.tag}: ${reason}`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async warn(guildId, userId, moderatorId, reason = 'No reason') {
    try {
      const warning = await ModerationRepo.add(guildId, userId, moderatorId, reason);
      const count = await ModerationRepo.count(guildId, userId);
      this.client.eventBus.emit('modAction', { action: 'warn', guildId, userId, moderatorId, reason, count });
      return { success: true, warning, count };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async getWarnings(guildId, userId) {
    return ModerationRepo.getAll(guildId, userId);
  }

  async clearWarnings(guildId, userId) {
    return ModerationRepo.clearAll(guildId, userId);
  }

  async removeWarning(warnId) {
    return ModerationRepo.remove(warnId);
  }
}

module.exports = ModerationService;
