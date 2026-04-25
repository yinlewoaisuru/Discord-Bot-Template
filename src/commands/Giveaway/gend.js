const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'gend', aliases: ['gstop'], description: 'End a giveaway.', category: 'Giveaway', usage: '<messageId>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const gwService = client.container.get('giveaway');
    const result = await gwService.end(args[0]);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error)] });
    await message.reply({ embeds: [createSuccessEmbed('🎊 Giveaway ended!')] });
  },
};
