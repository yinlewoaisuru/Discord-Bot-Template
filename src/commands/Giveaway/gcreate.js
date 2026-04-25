const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { parseDuration } = require('../../utils/formatters');

module.exports = { name: 'gcreate', aliases: ['gstart'], description: 'Create a giveaway.', category: 'Giveaway', usage: '<duration> <winners> <prize>', args: true, minArgs: 3, cooldown: 10, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const duration = parseDuration(args[0]);
    if (duration <= 0) return message.reply({ embeds: [createErrorEmbed('Invalid duration.')] });
    const winners = parseInt(args[1]);
    if (isNaN(winners) || winners < 1 || winners > 20) return message.reply({ embeds: [createErrorEmbed('Winners must be 1-20.')] });
    const prize = args.slice(2).join(' ');
    const gwService = client.container.get('giveaway');
    const result = await gwService.create({ guildId: message.guild.id, channelId: message.channel.id, hostId: message.author.id, prize, winners, duration });
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error)] });
    await message.reply({ embeds: [createSuccessEmbed(`🎉 Giveaway created!`)] });
  },
};
