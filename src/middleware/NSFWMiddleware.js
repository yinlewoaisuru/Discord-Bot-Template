const { createErrorEmbed } = require('../utils/embedBuilder');

async function NSFWMiddleware(context, next) {
  const { command, message, interaction } = context;
  if (!command.nsfw) return next();

  const channel = message?.channel ?? interaction?.channel;
  if (channel && !channel.nsfw) {
    context.handled = true;
    const embed = createErrorEmbed('This command can only be used in NSFW channels.');
    if (interaction) {
      if (interaction.replied || interaction.deferred) {
        return interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
      }
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
    }
    if (message) return message.reply({ embeds: [embed] }).catch(() => {});
    return;
  }

  return next();
}

module.exports = NSFWMiddleware;
