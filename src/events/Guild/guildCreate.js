const { Events } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.GuildCreate,
  once: false,
  async execute(guild, client) {
    logger.info(`[GuildCreate] Joined: ${guild.name} (${guild.id}) | Members: ${guild.memberCount}`);
    const statsService = client.container.get('stats');
    if (statsService) await statsService.trackGuildJoin();
  },
};
