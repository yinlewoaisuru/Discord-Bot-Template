const { createEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'glist', aliases: [], description: 'List active giveaways.', category: 'Giveaway', cooldown: 5,
  async run(client, message) {
    const gwService = client.container.get('giveaway');
    const active = await gwService.list(message.guild.id);
    if (!active.length) return message.reply({ embeds: [createEmbed({ type: 'info', title: '🎉 Active Giveaways', description: 'No active giveaways.' })] });
    const desc = active.map(g => `**${g.prize}** in <#${g.channelId}>\nEnds: <t:${Math.floor(g.endsAt.getTime() / 1000)}:R>`).join('\n\n');
    await message.reply({ embeds: [createEmbed({ type: 'info', title: `🎉 Active Giveaways (${active.length})`, description: desc })] });
  },
};
