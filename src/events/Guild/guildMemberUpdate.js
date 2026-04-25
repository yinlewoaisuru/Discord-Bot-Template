const { Events } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.GuildMemberUpdate,
  once: false,
  async execute(oldMember, newMember, client) {
    try {
      if (!oldMember.premiumSince && newMember.premiumSince) {
        const welcomeService = client.container.get('welcome');
        if (welcomeService) await welcomeService.sendBoost(newMember);
      }
    } catch (err) {
      logger.error('[GuildMemberUpdate]', err.message);
    }
  },
};
