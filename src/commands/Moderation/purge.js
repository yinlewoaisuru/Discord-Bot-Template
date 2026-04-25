const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'purge', aliases: ['clear', 'prune'], description: 'Delete messages in bulk.', category: 'Moderation', usage: '<amount>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageMessages], botPermissions: [PermissionFlagsBits.ManageMessages],
  async run(client, message, args) {
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) return message.reply({ embeds: [createErrorEmbed('Amount must be between 1 and 100.')] });
    try {
      await message.delete().catch(() => {});
      const deleted = await message.channel.bulkDelete(amount, true);
      const msg = await message.channel.send({ embeds: [createSuccessEmbed(`🧹 Deleted **${deleted.size}** messages.`)] });
      setTimeout(() => msg.delete().catch(() => {}), 3000);
    } catch (err) {
      await message.channel.send({ embeds: [createErrorEmbed(err.message)] });
    }
  },
};
