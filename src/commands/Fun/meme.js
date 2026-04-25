const { createEmbed } = require('../../utils/embedBuilder');
const { get } = require('../../utils/apiClient');

module.exports = { name: 'meme', aliases: [], description: 'Get a random meme.', category: 'Fun', cooldown: 5,
  async run(client, message) {
    try {
      const data = await get('https://meme-api.com/gimme');
      const embed = createEmbed({ type: 'fun', title: data.title || 'Meme', description: `👍 ${data.ups || 0} | r/${data.subreddit || 'memes'}`, image: data.url });
      await message.reply({ embeds: [embed] });
    } catch (_) {
      await message.reply('Could not fetch meme.');
    }
  },
};
