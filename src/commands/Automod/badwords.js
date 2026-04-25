const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'badwords', aliases: ['bw'], description: 'Manage bad words list.', category: 'Automod', usage: '<add|remove|list> [word]', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const automodService = client.container.get('automod');
    const config = await automodService.getConfig(message.guild.id);
    const action = args[0].toLowerCase();
    if (action === 'list') {
      const words = config.badWords?.words || [];
      return message.reply({ embeds: [createSuccessEmbed(words.length > 0 ? `📋 Bad words: ${words.map(w => `\`${w}\``).join(', ')}` : 'No bad words configured.')] });
    }
    if (action === 'add' && args[1]) {
      const word = args[1].toLowerCase();
      const words = config.badWords?.words || [];
      if (words.includes(word)) return message.reply({ embeds: [createErrorEmbed('Word already in list.')] });
      words.push(word);
      await automodService.updateConfig(message.guild.id, { 'badWords.words': words });
      return message.reply({ embeds: [createSuccessEmbed(`Added \`${word}\` to bad words list.`)] });
    }
    if (action === 'remove' && args[1]) {
      const word = args[1].toLowerCase();
      const words = (config.badWords?.words || []).filter(w => w !== word);
      await automodService.updateConfig(message.guild.id, { 'badWords.words': words });
      return message.reply({ embeds: [createSuccessEmbed(`Removed \`${word}\` from bad words list.`)] });
    }
  },
};
