const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveChannel } = require('../../utils/resolvers');
const GuildRepo = require('../../database/repositories/GuildRepo');

module.exports = { name: 'setlog', aliases: ['setlogs'], description: 'Set the logging channel.', category: 'Config', usage: '<channel>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const channel = resolveChannel(message.guild, args[0]);
    if (!channel) return message.reply({ embeds: [createErrorEmbed('Channel not found.')] });
    await GuildRepo.update(message.guild.id, { logChannel: channel.id });
    await message.reply({ embeds: [createSuccessEmbed(`Log channel set to ${channel}.`)] });
  },
};
