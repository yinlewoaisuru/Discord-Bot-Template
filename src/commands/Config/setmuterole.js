const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveRole } = require('../../utils/resolvers');
const GuildRepo = require('../../database/repositories/GuildRepo');

module.exports = { name: 'setmuterole', aliases: [], description: 'Set the mute role.', category: 'Config', usage: '<role>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const role = resolveRole(message.guild, args.join(' '));
    if (!role) return message.reply({ embeds: [createErrorEmbed('Role not found.')] });
    await GuildRepo.update(message.guild.id, { muteRole: role.id });
    await message.reply({ embeds: [createSuccessEmbed(`Mute role set to ${role}.`)] });
  },
};
