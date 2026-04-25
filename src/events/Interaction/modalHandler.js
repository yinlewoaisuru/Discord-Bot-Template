const { Events } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction, client) {
    if (!interaction.isModalSubmit()) return;

    const component = client.components.get(interaction.customId);
    if (!component?.execute) return;

    try {
      await component.execute(interaction, client);
    } catch (err) {
      logger.error(`[Modal] ${interaction.customId}:`, err.message);
    }
  },
};
