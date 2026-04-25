const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = {
  name: 'untimeout',
  aliases: ['uto', 'removetimeout'],
  description: 'Remove timeout from a member.',
  category: 'Moderation',
  usage: '<user>',
  args: true,
  cooldown: 5,
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const modService = client.container.get('moderation');
    const result = await modService.untimeout(message.guild, member, message.member);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error)] });
    await message.reply({ embeds: [createSuccessEmbed(`⏰ Timeout removed from **${member.user.tag}**.`)] });
  },
};
