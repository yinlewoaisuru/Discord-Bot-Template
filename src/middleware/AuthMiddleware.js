const config = require('../config/bot.config');
const { createErrorEmbed } = require('../utils/embedBuilder');

async function AuthMiddleware(context, next) {
  const { command, message, interaction } = context;
  if (!command.ownerOnly) return next();

  const userId = message?.author?.id ?? interaction?.user?.id;
  const isOwner = config.ownerIds.includes(userId) || config.developerIds.includes(userId);

  if (!isOwner) {
    context.handled = true;
    const embed = createErrorEmbed('This command is only for bot owners.');
    if (interaction) {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
      }
    } else if (message) {
      await message.reply({ embeds: [embed] }).catch(() => {});
    }
    return;
  }

  return next();
}

module.exports = AuthMiddleware;
