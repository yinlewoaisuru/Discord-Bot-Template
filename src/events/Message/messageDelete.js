const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageDelete,
  once: false,
  async execute(message, client) {
    if (!message.content || message.author?.bot) return;

    const snipeService = client.container.get('snipe');
    if (snipeService) {
      snipeService.addDeleted(message.channel.id, message);
    }

    const logService = client.container.get('log');
    if (logService && message.guild) {
      await logService.logMessage(message.guild.id, {
        action: 'Deleted',
        author: message.author,
        channel: message.channel,
        content: message.content,
      });
    }
  },
};
