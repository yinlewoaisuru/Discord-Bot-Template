const { Events } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.GuildBanAdd,
  once: false,
  async execute(ban, client) {
    const logService = client.container.get('log');
    if (logService) {
      await logService.log(ban.guild.id, { title: '🔨 Member Banned', description: `**${ban.user.tag}** (${ban.user.id})\nReason: ${ban.reason || 'No reason'}`, type: 'moderation' });
    }
  },
};
