const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'setxp', aliases: [], description: 'Set XP for a user.', category: 'Leveling', usage: '<user> <xp>', args: true, minArgs: 2, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const xp = parseInt(args[1]);
    if (isNaN(xp) || xp < 0) return message.reply({ embeds: [createErrorEmbed('Invalid XP amount.')] });
    const levelingService = client.container.get('leveling');
    await levelingService.setXp(member.id, message.guild.id, xp);
    await message.reply({ embeds: [createSuccessEmbed(`Set XP of **${member.user.tag}** to **${xp}**.`)] });
  },
};
