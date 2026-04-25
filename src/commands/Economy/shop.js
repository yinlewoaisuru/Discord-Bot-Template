const { createEconomyEmbed } = require('../../utils/embedBuilder');
module.exports = { name: 'shop', aliases: ['store'], description: 'View the shop.', category: 'Economy', cooldown: 5,
  async run(client, message) {
    const items = [
      { id: 'fishing_rod', name: '🎣 Fishing Rod', price: 500, desc: 'Catch fish for gems' },
      { id: 'pickaxe', name: '⛏️ Pickaxe', price: 1000, desc: 'Mine for gems' },
      { id: 'lucky_coin', name: '🪙 Lucky Coin', price: 2500, desc: '+10% rob success rate' },
      { id: 'shield', name: '🛡️ Shield', price: 5000, desc: 'Protect from robbery' },
      { id: 'xp_boost', name: '✨ XP Booster', price: 10000, desc: '2x XP for 1 hour' },
    ];
    const desc = items.map(i => `**${i.name}** — 💎 ${i.price.toLocaleString()}\n> ${i.desc}`).join('\n\n');
    await message.reply({ embeds: [createEconomyEmbed({ title: '🛒 Shop', description: desc, footerOverride: { text: `Use ${client.config.prefix}buy <item> to purchase` } })] });
  },
};
