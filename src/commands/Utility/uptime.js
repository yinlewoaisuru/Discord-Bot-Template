const { createInfoEmbed } = require('../../utils/embedBuilder');
const { formatDuration } = require('../../utils/formatters');

module.exports = {
  name: 'uptime',
  aliases: ['up'],
  description: 'Show bot uptime.',
  category: 'Utility',
  cooldown: 3,
  async run(client, message) {
    await message.reply({ embeds: [createInfoEmbed(`⏱️ Bot uptime: **${formatDuration(client.uptime)}**`)] });
  },
};
