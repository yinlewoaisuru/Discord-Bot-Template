const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'softban', aliases: ['sb'], description: 'Ban and immediately unban a member to clear messages.', category: 'Moderation', usage: '<user> [reason]', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.BanMembers], botPermissions: [PermissionFlagsBits.BanMembers],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const reason = args.slice(1).join(' ') || 'Softban';
    try {
      await member.ban({ deleteMessageDays: 7, reason });
      await message.guild.bans.remove(member.id, 'Softban');
      await message.reply({ embeds: [createSuccessEmbed(`🔨 **${member.user.tag}** has been softbanned.\nReason: ${reason}`)] });
    } catch (err) { await message.reply({ embeds: [createErrorEmbed(err.message)] }); }
  },
};
