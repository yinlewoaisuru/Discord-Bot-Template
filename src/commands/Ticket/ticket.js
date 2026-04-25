const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'ticket', aliases: ['new'], description: 'Create a support ticket.', category: 'Ticket', usage: '[subject]', cooldown: 30,
  async run(client, message, args) {
    const ticketService = client.container.get('ticket');
    if (!ticketService) return;
    const subject = args.join(' ') || 'Support';
    const result = await ticketService.create(message.guild, message.author, subject);
    if (!result.success) {
      if (result.error === 'maxOpen') return message.reply({ embeds: [createErrorEmbed('You already have a ticket open.')] });
      return message.reply({ embeds: [createErrorEmbed(result.error)] });
    }
    await message.reply({ embeds: [createSuccessEmbed(`🎫 Ticket created: ${result.channel}`)] });
  },
};
