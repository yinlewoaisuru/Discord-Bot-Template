const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const GuildRepo = require('../../database/repositories/GuildRepo');

module.exports = { name: 'setprefix', aliases: ['prefix'], description: 'Change the bot prefix.', category: 'Config', usage: '<prefix>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const prefix = args[0];
    if (prefix.length > 5) return message.reply({ embeds: [createErrorEmbed('Prefix must be 5 characters or less.')] });
    await GuildRepo.update(message.guild.id, { prefix });
    await message.reply({ embeds: [createSuccessEmbed(`Prefix changed to \`${prefix}\`.`)] });
  },
};
