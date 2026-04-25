const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'slowmode', aliases: ['sm'], description: 'Set channel slowmode.', category: 'Moderation', usage: '<seconds>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageChannels], botPermissions: [PermissionFlagsBits.ManageChannels],
  async run(client, message, args) {
    const seconds = parseInt(args[0]);
    if (isNaN(seconds) || seconds < 0 || seconds > 21600) return message.reply({ embeds: [createErrorEmbed('Slowmode must be 0-21600 seconds.')] });
    await message.channel.setRateLimitPerUser(seconds);
    await message.reply({ embeds: [createSuccessEmbed(seconds === 0 ? '🐌 Slowmode disabled.' : `🐌 Slowmode set to **${seconds}s**.`)] });
  },
};
