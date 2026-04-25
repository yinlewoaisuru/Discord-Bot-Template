const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { formatRelativeTime } = require('../../utils/formatters');

module.exports = {
  name: 'snipe',
  aliases: ['s'],
  description: 'Show the last deleted message in this channel.',
  category: 'Utility',
  cooldown: 5,
  async run(client, message) {
    const snipeService = client.container.get('snipe');
    if (!snipeService) return message.reply({ embeds: [createErrorEmbed('Snipe service unavailable.')] });
    const data = snipeService.getDeleted(message.channel.id);
    if (!data) return message.reply({ embeds: [createErrorEmbed('Nothing to snipe.')] });
    const embed = createEmbed({
      type: 'info',
      title: '🔍 Sniped Message',
      description: data.content || '*No text content*',
      author: { name: data.author || 'Unknown', iconURL: data.avatar },
      footerOverride: { text: formatRelativeTime(data.timestamp) },
    });
    if (data.attachments?.length) embed.setImage(data.attachments[0]);
    await message.reply({ embeds: [embed] });
  },
};
