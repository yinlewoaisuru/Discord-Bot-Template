const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'clearwarnings', aliases: ['clearwarns', 'cw'], description: 'Clear all warnings for a member.', category: 'Moderation', usage: '<user>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ModerateMembers],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const modService = client.container.get('moderation');
    await modService.clearWarnings(message.guild.id, member.id);
    await message.reply({ embeds: [createSuccessEmbed(`🧹 All warnings cleared for **${member.user.tag}**.`)] });
  },
};
