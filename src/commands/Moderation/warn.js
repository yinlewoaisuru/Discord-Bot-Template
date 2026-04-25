const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'warn', aliases: [], description: 'Warn a member.', category: 'Moderation', usage: '<user> [reason]', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ModerateMembers],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const reason = args.slice(1).join(' ') || 'No reason provided';
    const modService = client.container.get('moderation');
    const result = await modService.warn(message.guild.id, member.id, message.author.id, reason);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error)] });
    await message.reply({ embeds: [createSuccessEmbed(`⚠️ **${member.user.tag}** has been warned. (Total: ${result.count})\nReason: ${reason}`)] });
  },
};
