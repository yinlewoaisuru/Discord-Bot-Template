const { Events } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.GuildMemberRemove,
  once: false,
  async execute(member, client) {
    try {
      const welcomeService = client.container.get('welcome');
      if (welcomeService) await welcomeService.sendLeave(member);
    } catch (err) {
      logger.error('[GuildMemberRemove]', err.message);
    }
  },
};
