const { createEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'choose', aliases: ['pick', 'random'], description: 'Choose between options.', category: 'Fun', usage: '<opt1> | <opt2> [| opt3...]', args: true, cooldown: 3,
  async run(client, message, args) {
    const options = args.join(' ').split('|').map(o => o.trim()).filter(Boolean);
    if (options.length < 2) return message.reply('Provide at least 2 options separated by `|`.');
    const choice = options[Math.floor(Math.random() * options.length)];
    await message.reply({ embeds: [createEmbed({ type: 'fun', title: '🤔 I Choose...', description: `**${choice}**` })] });
  },
};
