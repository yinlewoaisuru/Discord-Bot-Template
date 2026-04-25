const { createEconomyEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { formatNumber, formatDuration } = require('../../utils/formatters');

module.exports = { name: 'weekly', aliases: [], description: 'Claim your weekly reward.', category: 'Economy', cooldown: 5,
  async run(client, message) {
    const eco = client.container.get('economy');
    const result = await eco.claimWeekly(message.author.id, message.guild.id);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(`Already claimed. Come back in **${formatDuration(result.cooldown)}**.`)] });
    await message.reply({ embeds: [createEconomyEmbed({ title: '📆 Weekly Reward', description: `You received 💎 **${formatNumber(result.amount)}** gems!` })] });
  },
};
