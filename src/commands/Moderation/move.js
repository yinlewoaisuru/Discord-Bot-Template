const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember, resolveChannel } = require('../../utils/resolvers');

module.exports = { name: 'move', aliases: ['movemember'], description: 'Move a member to another voice channel.', category: 'Moderation', usage: '<user> <channel>', args: true, minArgs: 2, cooldown: 5, userPermissions: [PermissionFlagsBits.MoveMembers], botPermissions: [PermissionFlagsBits.MoveMembers],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    if (!member.voice.channel) return message.reply({ embeds: [createErrorEmbed('User is not in a voice channel.')] });
    const channel = resolveChannel(message.guild, args[1]);
    if (!channel) return message.reply({ embeds: [createErrorEmbed('Channel not found.')] });
    try {
      await member.voice.setChannel(channel);
      await message.reply({ embeds: [createSuccessEmbed(`Moved **${member.user.tag}** to **${channel.name}**.`)] });
    } catch (err) { await message.reply({ embeds: [createErrorEmbed(err.message)] }); }
  },
};
