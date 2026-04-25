const { SlashCommandBuilder } = require('discord.js');
const {
  createContainer,
  addText,
  addGallery,
  composeContainerMessage,
} = require('../../utils/containerBuilder');
const { createErrorEmbed } = require('../../utils/embedBuilder');
const logger = require('../../utils/logger');

module.exports = {
  category: 'Components',
  data: new SlashCommandBuilder()
    .setName('gallery-demo')
    .setDescription('Show a media gallery demo'),
  async run(_, interaction) {
    try {
      const container = createContainer({ type: 'fun' });
      addText(container, '## Media Gallery Demo');
      addGallery(container, [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80',
        'https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&w=1280&q=80',
      ]);

      await interaction.reply(composeContainerMessage({ container }));
    } catch (err) {
      logger.error('[Slash] gallery-demo:', err.message);
      const embed = createErrorEmbed('Unable to render gallery demo.');
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
      }
    }
  },
};
