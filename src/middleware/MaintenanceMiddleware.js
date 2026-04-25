const config = require('../config/bot.config');
const { createInfoEmbed } = require('../utils/embedBuilder');

async function MaintenanceMiddleware(context, next) {
  const { client, message, interaction } = context;
  if (!client.maintenanceMode) return next();

  const userId = message?.author?.id ?? interaction?.user?.id;
  if (config.ownerIds.includes(userId) || config.developerIds.includes(userId)) {
    return next();
  }

  context.handled = true;
  const embed = createInfoEmbed(config.maintenance.message, 'Maintenance');

  if (interaction) {
    if (interaction.replied || interaction.deferred) {
      return interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
    }
    return interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
  }

  if (message) return message.reply({ embeds: [embed] }).catch(() => {});
}

module.exports = MaintenanceMiddleware;
