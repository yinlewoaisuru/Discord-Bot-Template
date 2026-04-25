const BaseService = require('../core/BaseService');
const GuildRepo = require('../database/repositories/GuildRepo');
const { createEmbed } = require('../utils/embedBuilder');
const logger = require('../utils/logger');

class LogService extends BaseService {
  async log(guildId, { title, description, type = 'logging', fields = [] }) {
    try {
      const config = await GuildRepo.get(guildId);
      if (!config.logChannel) return;
      const channel = this.client.channels.cache.get(config.logChannel);
      if (!channel) return;
      const embed = createEmbed({ type, title, description, fields });
      await channel.send({ embeds: [embed] });
    } catch (err) {
      logger.error('[LogService] Log failed:', err.message);
    }
  }

  async logModAction({ guildId, action, target, moderator, reason, extra }) {
    await this.log(guildId, {
      title: `🛡️ ${action.toUpperCase()}`,
      type: 'moderation',
      fields: [
        { name: 'Target', value: target ? `${target.tag} (${target.id})` : 'Unknown', inline: true },
        { name: 'Moderator', value: moderator ? `${moderator.tag}` : 'Unknown', inline: true },
        { name: 'Reason', value: reason || 'No reason', inline: false },
        ...(extra ? [{ name: 'Details', value: extra, inline: false }] : []),
      ],
    });
  }

  async logMessage(guildId, { action, author, channel, content }) {
    await this.log(guildId, {
      title: `📝 Message ${action}`,
      type: 'logging',
      fields: [
        { name: 'Author', value: author ? `${author.tag}` : 'Unknown', inline: true },
        { name: 'Channel', value: channel ? `<#${channel.id}>` : 'Unknown', inline: true },
        { name: 'Content', value: content ? content.slice(0, 1024) : 'N/A', inline: false },
      ],
    });
  }
}

module.exports = LogService;
