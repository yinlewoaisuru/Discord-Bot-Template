const { createInfoEmbed } = require('../../utils/embedBuilder');

module.exports = {
  name: 'ping',
  aliases: ['latency', 'pong'],
  description: 'Check bot latency and API ping.',
  category: 'Utility',
  cooldown: 3,
  userPermissions: [],
  botPermissions: [],
  async run(client, message) {
    const sent = await message.reply({ embeds: [createInfoEmbed('🏓 Pinging...')] });
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiPing = Math.round(client.ws.ping);
    const embed = createInfoEmbed(`🏓 **Pong!**\n\n> Latency: **${latency}ms**\n> API: **${apiPing}ms**`);
    await sent.edit({ embeds: [embed] });
  },
};
