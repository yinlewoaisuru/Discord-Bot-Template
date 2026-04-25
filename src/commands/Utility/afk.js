const { createSuccessEmbed } = require('../../utils/embedBuilder');

module.exports = {
  name: 'afk',
  aliases: [],
  description: 'Set your AFK status.',
  category: 'Utility',
  usage: '[reason]',
  cooldown: 10,
  async run(client, message, args) {
    const reason = args.join(' ') || 'AFK';
    const afkService = client.container.get('afk');
    if (!afkService) return;
    await afkService.set(message.author.id, message.guild.id, reason);
    await message.reply({ embeds: [createSuccessEmbed(`💤 **${message.author.username}** is now AFK: ${reason}`)] });
  },
};
