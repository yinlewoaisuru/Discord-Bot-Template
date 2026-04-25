const { createWarningEmbed } = require('../utils/embedBuilder');
const { formatDuration } = require('../utils/formatters');

async function CooldownMiddleware(context, next) {
  const { command, client, message, interaction } = context;
  const userId = message?.author?.id ?? interaction?.user?.id;
  const cooldownMs = client.cooldowns?.get(command.name, userId);

  if (!cooldownMs) {
    const cd = (command.cooldown ?? 3) * 1000;
    if (cd > 0) client.cooldowns?.set(command.name, userId, command.cooldown ?? 3);
    return next();
  }

  const remaining = client.cooldowns.get(command.name, userId);
  if (remaining > 0) {
    context.handled = true;
    const embed = createWarningEmbed(`Please wait **${formatDuration(remaining)}** before using this command again.`);
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

  client.cooldowns?.set(command.name, userId, command.cooldown ?? 3);
  return next();
}

module.exports = CooldownMiddleware;
