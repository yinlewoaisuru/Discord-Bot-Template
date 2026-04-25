const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');
const GuildRepo = require('../../database/repositories/GuildRepo');

module.exports = {
  name: 'unmute',
  aliases: [],
  description: 'Unmute a member.',
  category: 'Moderation',
  usage: '<user>',
  args: true,
  cooldown: 5,
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const config = await GuildRepo.get(message.guild.id);
    if (!config.muteRole) return message.reply({ embeds: [createErrorEmbed('Mute role not set.')] });
    try {
      await member.roles.remove(config.muteRole);
      await message.reply({ embeds: [createSuccessEmbed(`🔊 **${member.user.tag}** has been unmuted.`)] });
    } catch (err) {
      await message.reply({ embeds: [createErrorEmbed(err.message)] });
    }
  },
};
