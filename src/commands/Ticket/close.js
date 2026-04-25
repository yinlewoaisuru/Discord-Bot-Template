const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'close', aliases: ['closeticket'], description: 'Close the current ticket.', category: 'Ticket', cooldown: 5,
  async run(client, message) {
    const ticketService = client.container.get('ticket');
    if (!ticketService) return;
    const result = await ticketService.close(message.channel.id, message.author.id);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error === 'notFound' ? 'This is not a ticket channel.' : result.error)] });
    await message.reply({ embeds: [createSuccessEmbed('📪 Ticket will be closed in 5 seconds...')] });
    setTimeout(async () => { try { await message.channel.delete(); } catch (_) {} }, 5000);
  },
};
