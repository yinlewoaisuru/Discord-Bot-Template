const { createEconomyEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');
const { formatNumber, formatDuration } = require('../../utils/formatters');

module.exports = { name: 'rob', aliases: ['steal'], description: 'Rob another user.', category: 'Economy', usage: '<user>', args: true, cooldown: 5,
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member || member.id === message.author.id) return message.reply({ embeds: [createErrorEmbed('Invalid target.')] });
    const eco = client.container.get('economy');
    const result = await eco.rob(message.author.id, member.id, message.guild.id);
    if (!result.success) { if (result.cooldown) return message.reply({ embeds: [createErrorEmbed(`Cooldown: **${formatDuration(result.cooldown)}**`)] }); return message.reply({ embeds: [createErrorEmbed(result.error === 'targetPoor' ? 'Target is too poor to rob.' : result.error)] }); }
    if (result.won) { await message.reply({ embeds: [createEconomyEmbed({ title: '💰 Rob', description: `You robbed 💎 **${formatNumber(result.amount)}** from **${member.user.tag}**!` })] }); }
    else { await message.reply({ embeds: [createErrorEmbed(`Caught! Fined 💎 **${formatNumber(result.amount)}** gems.`)] }); }
  },
};
