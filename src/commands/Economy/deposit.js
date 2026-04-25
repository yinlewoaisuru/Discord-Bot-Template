const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { formatNumber } = require('../../utils/formatters');

module.exports = { name: 'deposit', aliases: ['dep'], description: 'Deposit gems to bank.', category: 'Economy', usage: '<amount|all>', args: true, cooldown: 5,
  async run(client, message, args) {
    const eco = client.container.get('economy');
    const data = await eco.getBalance(message.author.id, message.guild.id);
    const amount = args[0] === 'all' ? data.wallet : parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) return message.reply({ embeds: [createErrorEmbed('Invalid amount.')] });
    const result = await eco.deposit(message.author.id, message.guild.id, amount);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed('Not enough gems in wallet.')] });
    await message.reply({ embeds: [createSuccessEmbed(`🏦 Deposited 💎 **${formatNumber(amount)}** gems.`)] });
  },
};
