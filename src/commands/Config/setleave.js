const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveChannel } = require('../../utils/resolvers');
const GuildRepo = require('../../database/repositories/GuildRepo');

module.exports = { name: 'setleave', aliases: [], description: 'Set the leave channel and message.', category: 'Config', usage: '<channel> [message]', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const channel = resolveChannel(message.guild, args[0]);
    if (!channel) return message.reply({ embeds: [createErrorEmbed('Channel not found.')] });
    const leaveMsg = args.slice(1).join(' ') || null;
    await GuildRepo.update(message.guild.id, { leaveChannel: channel.id, ...(leaveMsg && { leaveMessage: leaveMsg }) });
    await message.reply({ embeds: [createSuccessEmbed(`Leave channel set to ${channel}.`)] });
  },
};
