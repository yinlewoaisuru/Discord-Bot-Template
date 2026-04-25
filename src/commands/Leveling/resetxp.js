const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'resetxp', aliases: [], description: 'Reset XP for a user.', category: 'Leveling', usage: '<user>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const levelingService = client.container.get('leveling');
    await levelingService.resetXp(member.id, message.guild.id);
    await message.reply({ embeds: [createSuccessEmbed(`Reset XP of **${member.user.tag}**.`)] });
  },
};
