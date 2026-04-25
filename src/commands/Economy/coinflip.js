const { createEconomyEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'coinflip', aliases: ['cf', 'flip'], description: 'Flip a coin and bet gems.', category: 'Economy', usage: '<amount> <heads|tails>', args: true, minArgs: 2, cooldown: 5,
  async run(client, message, args) {
    const amount = parseInt(args[0]);
    const choice = args[1]?.toLowerCase();
    if (isNaN(amount) || amount <= 0) return message.reply('Invalid amount.');
    if (!['heads', 'tails', 'h', 't'].includes(choice)) return message.reply('Choose `heads` or `tails`.');
    const eco = client.container.get('economy');
    const data = await eco.getBalance(message.author.id, message.guild.id);
    if (data.wallet < amount) return message.reply('Not enough gems.');
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const pick = choice.startsWith('h') ? 'heads' : 'tails';
    const won = result === pick;
    if (won) { await eco.addMoney(message.author.id, message.guild.id, amount); }
    else { await eco.removeMoney(message.author.id, message.guild.id, amount); }
    await message.reply({ embeds: [createEconomyEmbed({ title: `🪙 Coinflip — ${result.toUpperCase()}`, description: won ? `You won 💎 **${amount.toLocaleString()}** gems!` : `You lost 💎 **${amount.toLocaleString()}** gems.` })] });
  },
};
