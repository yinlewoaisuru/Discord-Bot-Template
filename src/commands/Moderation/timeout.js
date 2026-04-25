const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');
const { parseDuration, formatDuration } = require('../../utils/formatters');

module.exports = {
  name: 'timeout',
  aliases: ['to'],
  description: 'Timeout a member.',
  category: 'Moderation',
  usage: '<user> <duration> [reason]',
  args: true,
  minArgs: 2,
  cooldown: 5,
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const duration = parseDuration(args[1]);
    if (duration <= 0 || duration > 28 * 24 * 60 * 60 * 1000) return message.reply({ embeds: [createErrorEmbed('Invalid duration (max 28 days).')] });
    const reason = args.slice(2).join(' ') || 'No reason provided';
    const modService = client.container.get('moderation');
    const result = await modService.timeout(message.guild, member, message.member, duration, reason);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error)] });
    await message.reply({ embeds: [createSuccessEmbed(`⏰ **${member.user.tag}** timed out for **${formatDuration(duration)}**.\nReason: ${reason}`)] });
  },
};
