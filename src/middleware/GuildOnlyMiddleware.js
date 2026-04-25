const { createErrorEmbed } = require('../utils/embedBuilder');

async function GuildOnlyMiddleware(context, next) {
  const { command, message, interaction } = context;
  if (!command.guildOnly) return next();

  const guild = message?.guild ?? interaction?.guild;
  if (!guild) {
    context.handled = true;
    const embed = createErrorEmbed('This command can only be used in a server.');
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

module.exports = GuildOnlyMiddleware;
