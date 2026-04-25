const { Events } = require('discord.js');
const { createErrorEmbed } = require('../../utils/embedBuilder');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slash.get(interaction.commandName);
    if (!command) return;

    try {
      await command.run(client, interaction);
      const statsService = client.container.get('stats');
      if (statsService) {
        try {
          await statsService.trackCommand(interaction.commandName);
        } catch (_) {}
      }
    } catch (err) {
      logger.error(`[Slash] ${interaction.commandName}:`, err.message);
      const embed = createErrorEmbed('An error occurred while executing this command.');
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
      }
    }
  },
};
