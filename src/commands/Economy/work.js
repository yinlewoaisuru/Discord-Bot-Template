const { createEconomyEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { formatNumber, formatDuration } = require('../../utils/formatters');
const { randomElement } = require('../../utils/formatters');
const jobs = ['programmer', 'doctor', 'teacher', 'artist', 'chef', 'driver', 'farmer', 'miner', 'mechanic', 'fisherman', 'writer', 'photographer'];

module.exports = { name: 'work', aliases: [], description: 'Work to earn gems.', category: 'Economy', cooldown: 5,
  async run(client, message) {
    const eco = client.container.get('economy');
    const result = await eco.work(message.author.id, message.guild.id);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(`You need to rest. Come back in **${formatDuration(result.cooldown)}**.`)] });
    const job = randomElement(jobs);
    await message.reply({ embeds: [createEconomyEmbed({ title: '💼 Work', description: `You worked as a **${job}** and earned 💎 **${formatNumber(result.amount)}** gems!` })] });
  },
};
