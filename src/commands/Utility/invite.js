const { createInfoEmbed } = require('../../utils/embedBuilder');

module.exports = {
  name: 'invite',
  aliases: ['inv'],
  description: 'Get the bot invite link.',
  category: 'Utility',
  cooldown: 5,
  async run(client, message) {
    await message.reply({ embeds: [createInfoEmbed(`🔗 [Invite Novela](${client.config.inviteUrl})\n🏠 [Support Server](${client.config.supportServerUrl})`)] });
  },
};
