const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageUpdate,
  once: false,
  async execute(oldMessage, newMessage, client) {
    if (!oldMessage.content || !newMessage.content) return;
    if (oldMessage.content === newMessage.content) return;
    if (oldMessage.author?.bot) return;

    const snipeService = client.container.get('snipe');
    if (snipeService) {
      snipeService.addEdited(oldMessage.channel.id, oldMessage, newMessage);
    }

    const logService = client.container.get('log');
    if (logService && oldMessage.guild) {
      await logService.logMessage(oldMessage.guild.id, {
        action: 'Edited',
        author: oldMessage.author,
        channel: oldMessage.channel,
        content: `**Before:** ${oldMessage.content.slice(0, 500)}\n**After:** ${newMessage.content.slice(0, 500)}`,
      });
    }
  },
};
