const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');
const { parseDuration, formatDuration } = require('../../utils/formatters');

module.exports = { name: 'xpboost', aliases: [], description: 'Give XP boost to a user.', category: 'Leveling', usage: '<user> <multiplier> <duration>', args: true, minArgs: 3, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const multiplier = parseFloat(args[1]);
    if (isNaN(multiplier) || multiplier < 1 || multiplier > 10) return message.reply({ embeds: [createErrorEmbed('Multiplier must be 1-10.')] });
    const duration = parseDuration(args[2]);
    if (duration <= 0) return message.reply({ embeds: [createErrorEmbed('Invalid duration.')] });
    const levelingService = client.container.get('leveling');
    await levelingService.setBoost(member.id, message.guild.id, multiplier, duration);
    await message.reply({ embeds: [createSuccessEmbed(`✨ XP Boost x**${multiplier}** for **${member.user.tag}** for **${formatDuration(duration)}**.`)] });
  },
};
