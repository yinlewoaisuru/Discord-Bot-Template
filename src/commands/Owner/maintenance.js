const { createSuccessEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'maintenance', aliases: ['maint'], description: 'Toggle maintenance mode.', category: 'Owner', ownerOnly: true, cooldown: 0,
  async run(client, message) {
    client.maintenanceMode = !client.maintenanceMode;
    await message.reply({ embeds: [createSuccessEmbed(`🔧 Maintenance mode: **${client.maintenanceMode ? 'ON' : 'OFF'}**`)] });
  },
};
