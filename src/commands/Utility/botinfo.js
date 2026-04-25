const { createEmbed } = require('../../utils/embedBuilder');
const { formatDuration, formatNumber } = require('../../utils/formatters');
const { version } = require('discord.js');

module.exports = {
  name: 'botinfo',
  aliases: ['bi', 'about', 'info'],
  description: 'Display bot information.',
  category: 'Utility',
  cooldown: 5,
  async run(client, message) {
    const mem = process.memoryUsage();
    const totalMembers = client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0), 0);
    const embed = createEmbed({
      type: 'default',
      title: '🌙 Novela Bot',
      thumbnail: client.user.displayAvatarURL({ size: 256 }),
      fields: [
        { name: 'Version', value: 'v3.0.0', inline: true },
        { name: 'Discord.js', value: `v${version}`, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'Servers', value: formatNumber(client.guilds.cache.size), inline: true },
        { name: 'Users', value: formatNumber(totalMembers), inline: true },
        { name: 'Channels', value: formatNumber(client.channels.cache.size), inline: true },
        { name: 'Commands', value: formatNumber(client.commands.size), inline: true },
        { name: 'Slash Commands', value: formatNumber(client.slash.size), inline: true },
        { name: 'Memory', value: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`, inline: true },
        { name: 'Uptime', value: formatDuration(client.uptime), inline: true },
        { name: 'Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true },
        { name: 'Platform', value: process.platform, inline: true },
      ],
    });
    await message.reply({ embeds: [embed] });
  },
};
