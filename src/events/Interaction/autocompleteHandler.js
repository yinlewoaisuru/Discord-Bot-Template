const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction, client) {
    if (!interaction.isAutocomplete()) return;

    const command = client.slash.get(interaction.commandName);
    if (!command?.autocomplete) return;

    try {
      await command.autocomplete(client, interaction);
    } catch (_) {}
  },
};
