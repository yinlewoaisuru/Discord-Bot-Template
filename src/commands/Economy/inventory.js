const { createEconomyEmbed } = require('../../utils/embedBuilder');
const EconomyRepo = require('../../database/repositories/EconomyRepo');

module.exports = { name: 'inventory', aliases: ['inv', 'items'], description: 'View your inventory.', category: 'Economy', cooldown: 5,
  async run(client, message) {
    const eco = await EconomyRepo.get(message.author.id, message.guild.id);
    const items = eco.inventory.filter(i => i.quantity > 0);
    const desc = items.length > 0 ? items.map(i => `${i.name} x**${i.quantity}**`).join('\n') : 'Empty inventory.';
    await message.reply({ embeds: [createEconomyEmbed({ title: `🎒 ${message.author.username}'s Inventory`, description: desc })] });
  },
};
