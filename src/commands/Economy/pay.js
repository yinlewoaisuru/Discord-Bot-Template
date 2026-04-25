const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');
const { formatNumber } = require('../../utils/formatters');

module.exports = { name: 'pay', aliases: ['send', 'give'], description: 'Send gems to another user.', category: 'Economy', usage: '<user> <amount>', args: true, minArgs: 2, cooldown: 5,
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    if (member.id === message.author.id) return message.reply({ embeds: [createErrorEmbed('You cannot pay yourself.')] });
    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount <= 0) return message.reply({ embeds: [createErrorEmbed('Invalid amount.')] });
    const eco = client.container.get('economy');
    const result = await eco.transfer(message.author.id, member.id, message.guild.id, amount);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed('You don\'t have enough gems.')] });
    await message.reply({ embeds: [createSuccessEmbed(`💸 Sent 💎 **${formatNumber(amount)}** gems to **${member.user.tag}**.`)] });
  },
};
