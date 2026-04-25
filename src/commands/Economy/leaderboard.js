const { createEconomyEmbed } = require('../../utils/embedBuilder');
const { formatNumber } = require('../../utils/formatters');

module.exports = { name: 'leaderboard', aliases: ['lb', 'top', 'rich'], description: 'View economy leaderboard.', category: 'Economy', cooldown: 10,
  async run(client, message) {
    const eco = client.container.get('economy');
    const board = await eco.getLeaderboard(message.guild.id);
    if (!board.length) return message.reply({ embeds: [createEconomyEmbed({ title: '🏆 Leaderboard', description: 'No data yet.' })] });
    const desc = board.map((e, i) => `**${i + 1}.** <@${e.userId}> — 💎 ${formatNumber(e.wallet + e.bank)}`).join('\n');
    await message.reply({ embeds: [createEconomyEmbed({ title: '🏆 Richest Leaderboard', description: desc })] });
  },
};
