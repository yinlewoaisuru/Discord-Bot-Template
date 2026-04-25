const { createEmbed } = require('../../utils/embedBuilder');
const { formatNumber } = require('../../utils/formatters');

module.exports = { name: 'xpleaderboard', aliases: ['xlb', 'xptop', 'levels'], description: 'View XP leaderboard.', category: 'Leveling', cooldown: 10,
  async run(client, message) {
    const levelingService = client.container.get('leveling');
    if (!levelingService) return;
    const board = await levelingService.getLeaderboard(message.guild.id);
    if (!board.length) return message.reply({ embeds: [createEmbed({ type: 'leveling', title: '🏆 XP Leaderboard', description: 'No data yet.' })] });
    const desc = board.map((e, i) => `**${i + 1}.** <@${e.userId}> — Level **${e.level}** (${formatNumber(e.totalXp)} XP)`).join('\n');
    await message.reply({ embeds: [createEmbed({ type: 'leveling', title: '🏆 XP Leaderboard', description: desc })] });
  },
};
