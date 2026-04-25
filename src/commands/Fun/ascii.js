const { createEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'ascii', aliases: [], description: 'Convert text to ASCII art.', category: 'Fun', usage: '<text>', args: true, cooldown: 5,
  async run(client, message, args) {
    const text = args.join(' ').slice(0, 20);
    const big = text.toUpperCase().split('').map(c => `**${c}**`).join(' ');
    await message.reply({ embeds: [createEmbed({ type: 'fun', title: '🔤 ASCII', description: `\`\`\`\n${text.toUpperCase()}\n\`\`\`\n${big}` })] });
  },
};
