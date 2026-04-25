const { PermissionFlagsBits } = require('discord.js');
const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');
const { formatDate } = require('../../utils/formatters');

module.exports = { name: 'warnings', aliases: ['warns', 'infractions'], description: 'View warnings for a member.', category: 'Moderation', usage: '<user>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ModerateMembers],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const modService = client.container.get('moderation');
    const warns = await modService.getWarnings(message.guild.id, member.id);
    if (!warns.length) return message.reply({ embeds: [createEmbed({ type: 'info', title: `⚠️ Warnings for ${member.user.tag}`, description: 'No warnings found.' })] });
    const list = warns.map((w, i) => `**${i + 1}.** ${w.reason}\n> By <@${w.moderator}> • ${formatDate(w.createdAt)} • ID: \`${w.warnId}\``).join('\n\n');
    await message.reply({ embeds: [createEmbed({ type: 'moderation', title: `⚠️ Warnings for ${member.user.tag} (${warns.length})`, description: list.slice(0, 4096) })] });
  },
};
