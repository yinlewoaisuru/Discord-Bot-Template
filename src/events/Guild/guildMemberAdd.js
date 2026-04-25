const { Events } = require('discord.js');
const GuildRepo = require('../../database/repositories/GuildRepo');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member, client) {
    try {
      const welcomeService = client.container.get('welcome');
      if (welcomeService) await welcomeService.sendWelcome(member);

      const config = await GuildRepo.get(member.guild.id);
      if (config.autoRole) {
        const role = member.guild.roles.cache.get(config.autoRole);
        if (role) await member.roles.add(role).catch(() => {});
      }
    } catch (err) {
      logger.error('[GuildMemberAdd]', err.message);
    }
  },
};
