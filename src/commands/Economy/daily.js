const { createEconomyEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { formatNumber, formatDuration } = require('../../utils/formatters');

module.exports = { name: 'daily', aliases: [], description: 'Claim your daily reward.', category: 'Economy', cooldown: 5,
  async run(client, message) {
    const ecoService = client.container.get('economy');
    const result = await ecoService.claimDaily(message.author.id, message.guild.id);
    const cfg = client.config.economy;
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(`You already claimed daily. Come back in **${formatDuration(result.cooldown)}**.`)] });
    await message.reply({ embeds: [createEconomyEmbed({ title: '📅 Daily Reward', description: `You received ${cfg.currencyEmoji} **${formatNumber(result.amount)}** gems!${result.streak ? `\n🔥 Streak: **${result.streak}** days` : ''}` })] });
  },
};
