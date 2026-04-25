const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveRole } = require('../../utils/resolvers');
const GuildRepo = require('../../database/repositories/GuildRepo');

module.exports = { name: 'setautorole', aliases: [], description: 'Set the auto role for new members.', category: 'Config', usage: '<role>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const role = resolveRole(message.guild, args.join(' '));
    if (!role) return message.reply({ embeds: [createErrorEmbed('Role not found.')] });
    await GuildRepo.update(message.guild.id, { autoRole: role.id });
    await message.reply({ embeds: [createSuccessEmbed(`Auto role set to ${role}. New members will receive this role.`)] });
  },
};
