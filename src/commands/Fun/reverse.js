const { createEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'reverse', aliases: ['rev'], description: 'Reverse text.', category: 'Fun', usage: '<text>', args: true, cooldown: 3,
  async run(client, message, args) {
    const text = args.join(' ');
    const reversed = [...text].reverse().join('');
    await message.reply({ embeds: [createEmbed({ type: 'fun', title: '🔄 Reversed', description: reversed })] });
  },
};
