const { createEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'rate', aliases: ['ratewaifu'], description: 'Rate something.', category: 'Fun', usage: '<thing>', args: true, cooldown: 3,
  async run(client, message, args) {
    const thing = args.join(' ');
    const rating = Math.floor(Math.random() * 11);
    const stars = '⭐'.repeat(Math.ceil(rating / 2)) + '☆'.repeat(5 - Math.ceil(rating / 2));
    await message.reply({ embeds: [createEmbed({ type: 'fun', title: '📊 Rating', description: `I rate **${thing}** a **${rating}/10**\n${stars}` })] });
  },
};
