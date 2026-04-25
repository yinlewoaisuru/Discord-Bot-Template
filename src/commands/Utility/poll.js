const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createEmbed } = require('../../utils/embedBuilder');

module.exports = {
  name: 'poll',
  aliases: ['vote'],
  description: 'Create a poll.',
  category: 'Utility',
  usage: '<question>',
  args: true,
  cooldown: 10,
  async run(client, message, args) {
    const question = args.join(' ');
    const embed = createEmbed({
      type: 'info',
      title: '📊 Poll',
      description: question,
      footerOverride: { text: `Poll by ${message.author.tag}` },
    });
    const msg = await message.channel.send({ embeds: [embed] });
    await msg.react('👍');
    await msg.react('👎');
    await msg.react('🤷');
  },
};
