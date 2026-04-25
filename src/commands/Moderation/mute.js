const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');
const GuildRepo = require('../../database/repositories/GuildRepo');

module.exports = {
  name: 'mute',
  aliases: [],
  description: 'Mute a member by assigning the mute role.',
  category: 'Moderation',
  usage: '<user> [reason]',
  args: true,
  cooldown: 5,
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const reason = args.slice(1).join(' ') || 'No reason provided';
    const config = await GuildRepo.get(message.guild.id);
    if (!config.muteRole) return message.reply({ embeds: [createErrorEmbed('Mute role not set. Use `.setmuterole <role>`.')] });
    const role = message.guild.roles.cache.get(config.muteRole);
    if (!role) return message.reply({ embeds: [createErrorEmbed('Mute role not found.')] });
    try {
      await member.roles.add(role, reason);
      await message.reply({ embeds: [createSuccessEmbed(`🔇 **${member.user.tag}** has been muted.\nReason: ${reason}`)] });
    } catch (err) {
      await message.reply({ embeds: [createErrorEmbed(err.message)] });
    }
  },
};
