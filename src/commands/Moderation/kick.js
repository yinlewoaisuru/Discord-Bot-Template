const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = {
  name: 'kick',
  aliases: [],
  description: 'Kick a member from the server.',
  category: 'Moderation',
  usage: '<user> [reason]',
  args: true,
  cooldown: 5,
  userPermissions: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    if (member.id === message.author.id) return message.reply({ embeds: [createErrorEmbed('You cannot kick yourself.')] });
    const reason = args.slice(1).join(' ') || 'No reason provided';
    const modService = client.container.get('moderation');
    const result = await modService.kick(message.guild, member, message.member, reason);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error)] });
    await message.reply({ embeds: [createSuccessEmbed(`👢 **${member.user.tag}** has been kicked.\nReason: ${reason}`)] });
  },
};
