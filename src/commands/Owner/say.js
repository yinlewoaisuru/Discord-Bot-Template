const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'say', aliases: ['echo'], description: 'Send a message as the bot.', category: 'Owner', ownerOnly: true, usage: '<message>', args: true, cooldown: 0,
  async run(client, message, args) {
    const text = args.join(' ');
    await message.delete().catch(() => {});
    await message.channel.send(text);
  },
};
