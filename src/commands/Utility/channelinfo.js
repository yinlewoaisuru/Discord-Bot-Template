const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveChannel } = require('../../utils/resolvers');
const { formatDate } = require('../../utils/formatters');

module.exports = {
  name: 'channelinfo',
  aliases: ['ci'],
  description: 'Display channel information.',
  category: 'Utility',
  usage: '[channel]',
  cooldown: 5,
  async run(client, message, args) {
    const channel = args[0] ? resolveChannel(message.guild, args[0]) || message.channel : message.channel;
    const embed = createEmbed({
      type: 'info',
      title: `#️⃣ ${channel.name}`,
      fields: [
        { name: 'ID', value: channel.id, inline: true },
        { name: 'Type', value: `${channel.type}`, inline: true },
        { name: 'Category', value: channel.parent?.name || 'None', inline: true },
        { name: 'Position', value: `${channel.position}`, inline: true },
        { name: 'NSFW', value: channel.nsfw ? 'Yes' : 'No', inline: true },
        { name: 'Created', value: formatDate(channel.createdAt), inline: true },
        { name: 'Topic', value: channel.topic || 'No topic', inline: false },
      ],
    });
    await message.reply({ embeds: [embed] });
  },
};
