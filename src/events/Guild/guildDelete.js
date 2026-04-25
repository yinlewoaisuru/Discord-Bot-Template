const { Events } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.GuildDelete,
  once: false,
  async execute(guild, client) {
    logger.info(`[GuildDelete] Left: ${guild.name} (${guild.id})`);
    const statsService = client.container.get('stats');
    if (statsService) await statsService.trackGuildLeave();
  },
};
