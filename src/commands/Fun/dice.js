const { createEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'dice', aliases: ['roll'], description: 'Roll dice.', category: 'Fun', usage: '[sides]', cooldown: 3,
  async run(client, message, args) {
    const sides = parseInt(args[0]) || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    await message.reply({ embeds: [createEmbed({ type: 'fun', title: '🎲 Dice Roll', description: `You rolled a **${result}** (d${sides})` })] });
  },
};
