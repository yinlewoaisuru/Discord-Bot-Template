const { createInfoEmbed } = require('../../utils/embedBuilder');

module.exports = {
  id: 'menu-demo-channel',
  async execute(interaction) {
    const selectedChannel = interaction.channels.first();
    const embed = createInfoEmbed(
      selectedChannel
        ? `Selected channel: ${selectedChannel}`
        : 'No channel selected.',
      'Channel Selected',
    );

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
    }
  },
};
