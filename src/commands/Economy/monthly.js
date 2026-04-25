const { createEconomyEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { formatNumber, formatDuration } = require('../../utils/formatters');

module.exports = { name: 'monthly', aliases: [], description: 'Claim your monthly reward.', category: 'Economy', cooldown: 5,
  async run(client, message) {
    const eco = client.container.get('economy');
    const result = await eco.claimMonthly(message.author.id, message.guild.id);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(`Already claimed. Come back in **${formatDuration(result.cooldown)}**.`)] });
    await message.reply({ embeds: [createEconomyEmbed({ title: '🗓️ Monthly Reward', description: `You received 💎 **${formatNumber(result.amount)}** gems!` })] });
  },
};
