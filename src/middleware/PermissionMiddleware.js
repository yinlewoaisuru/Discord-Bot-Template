const { createErrorEmbed } = require('../utils/embedBuilder');
const { checkUserPermissions, checkBotPermissions, formatPermissions } = require('../utils/permCheck');

async function PermissionMiddleware(context, next) {
  const { command, message, interaction } = context;
  const guild = message?.guild ?? interaction?.guild;
  const member = message?.member ?? interaction?.member;

  if (command.userPermissions?.length > 0) {
    const check = checkUserPermissions(member, command.userPermissions);
    if (!check.has) {
      context.handled = true;
      const embed = createErrorEmbed(`Missing permissions: ${formatPermissions(check.missing)}`);
      if (interaction) {
        if (interaction.replied || interaction.deferred) {
          return interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
        }
        return interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
      }
      if (message) return message.reply({ embeds: [embed] }).catch(() => {});
      return;
    }
  }

  if (command.botPermissions?.length > 0 && guild) {
    const check = checkBotPermissions(guild, command.botPermissions);
    if (!check.has) {
      context.handled = true;
      const embed = createErrorEmbed(`Bot missing permissions: ${formatPermissions(check.missing)}`);
      if (interaction) {
        if (interaction.replied || interaction.deferred) {
          return interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
        }
        return interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
      }
      if (message) return message.reply({ embeds: [embed] }).catch(() => {});
      return;
    }
  }

  return next();
}

module.exports = PermissionMiddleware;
