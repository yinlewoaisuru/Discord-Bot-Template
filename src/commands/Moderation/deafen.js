const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'deafen', aliases: ['deaf'], description: 'Server deafen a member.', category: 'Moderation', usage: '<user>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.DeafenMembers], botPermissions: [PermissionFlagsBits.DeafenMembers],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    if (!member.voice.channel) return message.reply({ embeds: [createErrorEmbed('User is not in a voice channel.')] });
    const deafened = !member.voice.serverDeaf;
    try {
      await member.voice.setDeaf(deafened);
      await message.reply({ embeds: [createSuccessEmbed(deafened ? `🔇 **${member.user.tag}** has been deafened.` : `🔊 **${member.user.tag}** has been undeafened.`)] });
    } catch (err) { await message.reply({ embeds: [createErrorEmbed(err.message)] }); }
  },
};
