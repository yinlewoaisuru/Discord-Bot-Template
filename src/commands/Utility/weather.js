const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { get } = require('../../utils/apiClient');

module.exports = {
  name: 'weather',
  aliases: ['w'],
  description: 'Get weather information for a city.',
  category: 'Utility',
  usage: '<city>',
  args: true,
  cooldown: 10,
  async run(client, message, args) {
    const city = args.join(' ');
    try {
      const data = await get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      const current = data.current_condition?.[0];
      if (!current) return message.reply({ embeds: [createErrorEmbed('City not found.')] });
      const embed = createEmbed({
        type: 'info',
        title: `🌤️ Weather in ${data.nearest_area?.[0]?.areaName?.[0]?.value || city}`,
        fields: [
          { name: 'Temperature', value: `${current.temp_C}°C / ${current.temp_F}°F`, inline: true },
          { name: 'Feels Like', value: `${current.FeelsLikeC}°C / ${current.FeelsLikeF}°F`, inline: true },
          { name: 'Condition', value: current.weatherDesc?.[0]?.value || 'N/A', inline: true },
          { name: 'Humidity', value: `${current.humidity}%`, inline: true },
          { name: 'Wind', value: `${current.windspeedKmph} km/h ${current.winddir16Point}`, inline: true },
          { name: 'Visibility', value: `${current.visibility} km`, inline: true },
        ],
      });
      await message.reply({ embeds: [embed] });
    } catch (_) {
      await message.reply({ embeds: [createErrorEmbed('Could not fetch weather data.')] });
    }
  },
};
