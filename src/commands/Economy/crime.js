const { createEconomyEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { formatNumber, formatDuration } = require('../../utils/formatters');

module.exports = { name: 'crime', aliases: [], description: 'Commit a crime for gems (risky).', category: 'Economy', cooldown: 5,
  async run(client, message) {
    const eco = client.container.get('economy');
    const result = await eco.crime(message.author.id, message.guild.id);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(`Cooldown. Come back in **${formatDuration(result.cooldown)}**.`)] });
    if (result.won) {
      await message.reply({ embeds: [createEconomyEmbed({ title: '🦹 Crime', description: `You committed a crime and earned 💎 **${formatNumber(result.amount)}** gems!` })] });
    } else {
      await message.reply({ embeds: [createErrorEmbed(`You got caught! Fined 💎 **${formatNumber(result.amount)}** gems.`)] });
    }
  },
};
