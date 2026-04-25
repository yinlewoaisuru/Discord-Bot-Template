const { createEmbed } = require('../../utils/embedBuilder');
const { get } = require('../../utils/apiClient');

module.exports = { name: 'fact', aliases: ['funfact'], description: 'Get a random fun fact.', category: 'Fun', cooldown: 5,
  async run(client, message) {
    try {
      const data = await get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
      await message.reply({ embeds: [createEmbed({ type: 'fun', title: '🧠 Fun Fact', description: data.text })] });
    } catch (_) { await message.reply('Could not fetch fact.'); }
  },
};
