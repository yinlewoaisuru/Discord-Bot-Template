const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveChannel } = require('../../utils/resolvers');
const GuildRepo = require('../../database/repositories/GuildRepo');

module.exports = { name: 'setwelcome', aliases: [], description: 'Set the welcome channel and message.', category: 'Config', usage: '<channel> [message]', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const channel = resolveChannel(message.guild, args[0]);
    if (!channel) return message.reply({ embeds: [createErrorEmbed('Channel not found.')] });
    const welcomeMsg = args.slice(1).join(' ') || null;
    await GuildRepo.update(message.guild.id, { welcomeChannel: channel.id, ...(welcomeMsg && { welcomeMessage: welcomeMsg }) });
    await message.reply({ embeds: [createSuccessEmbed(`Welcome channel set to ${channel}. ${welcomeMsg ? `\nMessage: ${welcomeMsg}` : ''}\n\nVariables: \`{user}\` \`{username}\` \`{server}\` \`{count}\``)] });
  },
};
