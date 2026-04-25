const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { get } = require('../../utils/apiClient');

module.exports = {
  name: 'translate',
  aliases: ['tr'],
  description: 'Translate text to another language.',
  category: 'Utility',
  usage: '<lang> <text>',
  args: true,
  minArgs: 2,
  cooldown: 5,
  async run(client, message, args) {
    const targetLang = args[0];
    const text = args.slice(1).join(' ');
    try {
      const data = await get(`https://api.mymemory.translated.net/get`, { q: text, langpair: `autodetect|${targetLang}` });
      if (!data?.responseData?.translatedText) return message.reply({ embeds: [createErrorEmbed('Translation failed.')] });
      const embed = createEmbed({
        type: 'info',
        title: '🌐 Translation',
        fields: [
          { name: 'Original', value: text.slice(0, 1024), inline: false },
          { name: `Translated (${targetLang})`, value: data.responseData.translatedText.slice(0, 1024), inline: false },
        ],
      });
      await message.reply({ embeds: [embed] });
    } catch (_) {
      await message.reply({ embeds: [createErrorEmbed('Translation service unavailable.')] });
    }
  },
};
