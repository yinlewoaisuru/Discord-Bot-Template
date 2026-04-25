const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const EconomyRepo = require('../../database/repositories/EconomyRepo');

const shopItems = { fishing_rod: { name: '🎣 Fishing Rod', price: 500 }, pickaxe: { name: '⛏️ Pickaxe', price: 1000 }, lucky_coin: { name: '🪙 Lucky Coin', price: 2500 }, shield: { name: '🛡️ Shield', price: 5000 }, xp_boost: { name: '✨ XP Booster', price: 10000 } };

module.exports = { name: 'buy', aliases: ['purchase'], description: 'Buy an item from the shop.', category: 'Economy', usage: '<item>', args: true, cooldown: 5,
  async run(client, message, args) {
    const itemId = args[0].toLowerCase();
    const item = shopItems[itemId];
    if (!item) return message.reply({ embeds: [createErrorEmbed(`Item not found. Available: ${Object.keys(shopItems).join(', ')}`)] });
    const eco = await EconomyRepo.get(message.author.id, message.guild.id);
    if (eco.wallet < item.price) return message.reply({ embeds: [createErrorEmbed('Not enough gems.')] });
    eco.wallet -= item.price;
    const existing = eco.inventory.find(i => i.itemId === itemId);
    if (existing) { existing.quantity += 1; } else { eco.inventory.push({ itemId, name: item.name, quantity: 1, price: item.price }); }
    await eco.save();
    await message.reply({ embeds: [createSuccessEmbed(`Bought ${item.name} for 💎 **${item.price}** gems!`)] });
  },
};
