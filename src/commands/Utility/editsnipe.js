const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { formatRelativeTime } = require('../../utils/formatters');

module.exports = {
  name: 'editsnipe',
  aliases: ['es'],
  description: 'Show the last edited message in this channel.',
  category: 'Utility',
  cooldown: 5,
  async run(client, message) {
    const snipeService = client.container.get('snipe');
    if (!snipeService) return message.reply({ embeds: [createErrorEmbed('Snipe service unavailable.')] });
    const data = snipeService.getEdited(message.channel.id);
    if (!data) return message.reply({ embeds: [createErrorEmbed('Nothing to snipe.')] });
    const embed = createEmbed({
      type: 'info',
      title: '✏️ Edit Sniped',
      fields: [
        { name: 'Before', value: data.oldContent?.slice(0, 1024) || '*empty*', inline: false },
        { name: 'After', value: data.newContent?.slice(0, 1024) || '*empty*', inline: false },
      ],
      author: { name: data.author || 'Unknown', iconURL: data.avatar },
      footerOverride: { text: formatRelativeTime(data.timestamp) },
    });
    await message.reply({ embeds: [embed] });
  },
};
