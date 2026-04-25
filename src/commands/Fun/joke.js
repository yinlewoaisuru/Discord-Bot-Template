const { createEmbed } = require('../../utils/embedBuilder');
const { get } = require('../../utils/apiClient');

module.exports = { name: 'joke', aliases: [], description: 'Get a random joke.', category: 'Fun', cooldown: 5,
  async run(client, message) {
    try {
      const data = await get('https://v2.jokeapi.dev/joke/Any?safe-mode&type=twopart');
      if (data.type === 'twopart') {
        await message.reply({ embeds: [createEmbed({ type: 'fun', title: '😂 Joke', description: `${data.setup}\n\n||${data.delivery}||` })] });
      } else {
        await message.reply({ embeds: [createEmbed({ type: 'fun', title: '😂 Joke', description: data.joke })] });
      }
    } catch (_) { await message.reply('Could not fetch joke.'); }
  },
};
