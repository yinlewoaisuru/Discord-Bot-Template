const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'tremove', aliases: ['ticketremove'], description: 'Remove a user from a ticket.', category: 'Ticket', usage: '<user>', args: true, cooldown: 5,
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const ticketService = client.container.get('ticket');
    const result = await ticketService.removeUser(message.channel.id, member.id, message.guild);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error)] });
    await message.reply({ embeds: [createSuccessEmbed(`Removed **${member.user.tag}** from this ticket.`)] });
  },
};
