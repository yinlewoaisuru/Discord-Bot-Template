const { createEmbed } = require('../../utils/embedBuilder');
const { formatNumber, formatDuration } = require('../../utils/formatters');

module.exports = { name: 'stats', aliases: ['botstats'], description: 'View detailed bot statistics.', category: 'Owner', ownerOnly: true, cooldown: 5,
  async run(client, message) {
    const statsService = client.container.get('stats');
    const sys = statsService.getSystemStats();
    const today = await statsService.getToday();
    const embed = createEmbed({
      type: 'info',
      title: '📊 Bot Statistics',
      fields: [
        { name: 'Uptime', value: formatDuration(sys.uptime), inline: true },
        { name: 'Memory (RSS)', value: `${sys.memory.rss}MB`, inline: true },
        { name: 'Heap Used', value: `${sys.memory.heapUsed}/${sys.memory.heapTotal}MB`, inline: true },
        { name: 'Guilds', value: formatNumber(sys.guilds), inline: true },
        { name: 'Users', value: formatNumber(sys.users), inline: true },
        { name: 'Channels', value: formatNumber(sys.channels), inline: true },
        { name: 'Commands Today', value: formatNumber(today?.commandsUsed || 0), inline: true },
        { name: 'Messages Today', value: formatNumber(today?.messagesProcessed || 0), inline: true },
        { name: 'Errors Today', value: formatNumber(today?.errorsLogged || 0), inline: true },
        { name: 'Node.js', value: sys.nodeVersion, inline: true },
        { name: 'Platform', value: sys.platform, inline: true },
      ],
    });
    await message.reply({ embeds: [embed] });
  },
};
