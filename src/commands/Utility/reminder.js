const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { parseDuration, formatDuration } = require('../../utils/formatters');

module.exports = {
  name: 'reminder',
  aliases: ['remind', 'remindme'],
  description: 'Set a reminder.',
  category: 'Utility',
  usage: '<time> <message>',
  args: true,
  minArgs: 2,
  cooldown: 5,
  async run(client, message, args) {
    const duration = parseDuration(args[0]);
    if (duration <= 0) return message.reply({ embeds: [createErrorEmbed('Invalid time format. Use: 1h, 30m, 1d, etc.')] });
    if (duration > 30 * 24 * 60 * 60 * 1000) return message.reply({ embeds: [createErrorEmbed('Maximum reminder duration is 30 days.')] });
    const text = args.slice(1).join(' ');
    const reminderService = client.container.get('reminder');
    if (!reminderService) return message.reply({ embeds: [createErrorEmbed('Reminder service unavailable.')] });
    await reminderService.create(message.author.id, message.channel.id, message.guild.id, text, new Date(Date.now() + duration));
    await message.reply({ embeds: [createSuccessEmbed(`🔔 Reminder set for **${formatDuration(duration)}** from now.\n\n> ${text}`)] });
  },
};
