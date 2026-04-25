const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveRole } = require('../../utils/resolvers');
const { formatDate } = require('../../utils/formatters');

module.exports = {
  name: 'roleinfo',
  aliases: ['ri', 'role'],
  description: 'Display role information.',
  category: 'Utility',
  usage: '<role>',
  args: true,
  cooldown: 5,
  async run(client, message, args) {
    const role = resolveRole(message.guild, args.join(' '));
    if (!role) return message.reply({ embeds: [createErrorEmbed('Role not found.')] });
    const embed = createEmbed({
      type: 'info',
      title: `🏷️ Role: ${role.name}`,
      color: role.hexColor,
      fields: [
        { name: 'ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Position', value: `${role.position}`, inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
        { name: 'Members', value: `${role.members.size}`, inline: true },
        { name: 'Created', value: formatDate(role.createdAt), inline: true },
        { name: 'Managed', value: role.managed ? 'Yes' : 'No', inline: true },
      ],
    });
    await message.reply({ embeds: [embed] });
  },
};
