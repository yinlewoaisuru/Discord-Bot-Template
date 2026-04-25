const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildBanRemove,
  once: false,
  async execute(ban, client) {
    const logService = client.container.get('log');
    if (logService) {
      await logService.log(ban.guild.id, { title: '🔓 Member Unbanned', description: `**${ban.user.tag}** (${ban.user.id})`, type: 'moderation' });
    }
  },
};
