const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = {
  name: 'calc',
  aliases: ['math', 'calculate'],
  description: 'Evaluate a math expression.',
  category: 'Utility',
  usage: '<expression>',
  args: true,
  cooldown: 3,
  async run(client, message, args) {
    const expr = args.join(' ').replace(/[^0-9+\-*/().%\s^]/g, '');
    if (!expr) return message.reply({ embeds: [createErrorEmbed('Invalid expression.')] });
    try {
      const safe = expr.replace(/\^/g, '**');
      const result = Function(`"use strict"; return (${safe})`)();
      if (typeof result !== 'number' || !isFinite(result)) throw new Error('Invalid');
      await message.reply({ embeds: [createEmbed({ type: 'info', title: '🧮 Calculator', fields: [{ name: 'Expression', value: `\`${expr}\``, inline: true }, { name: 'Result', value: `\`${result}\``, inline: true }] })] });
    } catch (_) {
      await message.reply({ embeds: [createErrorEmbed('Could not evaluate expression.')] });
    }
  },
};
