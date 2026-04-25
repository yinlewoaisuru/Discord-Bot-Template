const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'lock', aliases: ['lockdown'], description: 'Lock a channel.', category: 'Moderation', cooldown: 5, userPermissions: [PermissionFlagsBits.ManageChannels], botPermissions: [PermissionFlagsBits.ManageChannels],
  async run(client, message) {
    await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false });
    await message.reply({ embeds: [createSuccessEmbed('🔒 Channel has been locked.')] });
  },
};
