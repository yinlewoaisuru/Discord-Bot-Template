const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'unlock', aliases: [], description: 'Unlock a channel.', category: 'Moderation', cooldown: 5, userPermissions: [PermissionFlagsBits.ManageChannels], botPermissions: [PermissionFlagsBits.ManageChannels],
  async run(client, message) {
    await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: null });
    await message.reply({ embeds: [createSuccessEmbed('🔓 Channel has been unlocked.')] });
  },
};
