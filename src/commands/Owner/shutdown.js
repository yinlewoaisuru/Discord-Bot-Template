const { createSuccessEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'shutdown', aliases: ['die', 'stop'], description: 'Shutdown the bot.', category: 'Owner', ownerOnly: true, cooldown: 0,
  async run(client, message) {
    await message.reply({ embeds: [createSuccessEmbed('👋 Shutting down...')] });
    process.exit(0);
  },
};
