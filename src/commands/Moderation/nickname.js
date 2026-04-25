const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'nickname', aliases: ['nick', 'setnick'], description: 'Change a member\'s nickname.', category: 'Moderation', usage: '<user> <nickname|reset>', args: true, minArgs: 2, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageNicknames], botPermissions: [PermissionFlagsBits.ManageNicknames],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const nick = args.slice(1).join(' ');
    try {
      await member.setNickname(nick === 'reset' ? null : nick);
      await message.reply({ embeds: [createSuccessEmbed(nick === 'reset' ? `Reset nickname for **${member.user.tag}**.` : `Set nickname of **${member.user.tag}** to **${nick}**.`)] });
    } catch (err) { await message.reply({ embeds: [createErrorEmbed(err.message)] }); }
  },
};
