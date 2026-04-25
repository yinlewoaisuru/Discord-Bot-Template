const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const EconomyRepo = require('../../database/repositories/EconomyRepo');

module.exports = { name: 'sell', aliases: [], description: 'Sell an item from inventory.', category: 'Economy', usage: '<item>', args: true, cooldown: 5,
  async run(client, message, args) {
    const itemId = args[0].toLowerCase();
    const eco = await EconomyRepo.get(message.author.id, message.guild.id);
    const item = eco.inventory.find(i => i.itemId === itemId);
    if (!item || item.quantity <= 0) return message.reply({ embeds: [createErrorEmbed('You don\'t have that item.')] });
    const sellPrice = Math.floor(item.price * 0.5);
    item.quantity -= 1;
    if (item.quantity <= 0) eco.inventory = eco.inventory.filter(i => i.itemId !== itemId);
    eco.wallet += sellPrice;
    await eco.save();
    await message.reply({ embeds: [createSuccessEmbed(`Sold ${item.name} for 💎 **${sellPrice}** gems!`)] });
  },
};
