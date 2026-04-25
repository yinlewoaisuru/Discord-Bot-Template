const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'greroll', aliases: [], description: 'Reroll a giveaway winner.', category: 'Giveaway', usage: '<messageId>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const gwService = client.container.get('giveaway');
    const result = await gwService.reroll(args[0]);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error)] });
    await message.reply({ embeds: [createSuccessEmbed(`🔄 Rerolled! New winner: <@${result.winner}>`)] });
  },
};
