const { createEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'emojify', aliases: [], description: 'Convert text to emoji letters.', category: 'Fun', usage: '<text>', args: true, cooldown: 3,
  async run(client, message, args) {
    const text = args.join(' ').toLowerCase();
    const result = [...text].map(c => {
      if (c >= 'a' && c <= 'z') return `:regional_indicator_${c}: `;
      if (c === ' ') return '   ';
      if (c >= '0' && c <= '9') return ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'][parseInt(c)] + ' ';
      if (c === '?') return '❓ ';
      if (c === '!') return '❗ ';
      return c;
    }).join('');
    await message.reply(result.slice(0, 2000));
  },
};
