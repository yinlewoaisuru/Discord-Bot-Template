const { createEconomyEmbed } = require('../../utils/embedBuilder');
const { formatNumber } = require('../../utils/formatters');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'balance', aliases: ['bal', 'money'], description: 'Check your balance.', category: 'Economy', usage: '[user]', cooldown: 3,
  async run(client, message, args) {
    const member = args[0] ? resolveMember(message, args[0]) || message.member : message.member;
    const ecoService = client.container.get('economy');
    const data = await ecoService.getBalance(member.id, message.guild.id);
    const cfg = client.config.economy;
    await message.reply({ embeds: [createEconomyEmbed({ title: `${cfg.currencyEmoji} ${member.user.username}'s Balance`, fields: [{ name: '👛 Wallet', value: `${cfg.currencyEmoji} ${formatNumber(data.wallet)}`, inline: true }, { name: '🏦 Bank', value: `${cfg.currencyEmoji} ${formatNumber(data.bank)}`, inline: true }, { name: '💰 Total', value: `${cfg.currencyEmoji} ${formatNumber(data.wallet + data.bank)}`, inline: true }] })] });
  },
};
