const { SlashCommandBuilder } = require('discord.js');
const {
  createContainer,
  addText,
  addSeparator,
  addSection,
  createButton,
  composeContainerMessage,
  ButtonStyle,
} = require('../../utils/containerBuilder');
const { createErrorEmbed } = require('../../utils/embedBuilder');
const logger = require('../../utils/logger');

module.exports = {
  category: 'Components',
  data: new SlashCommandBuilder()
    .setName('ui-demo')
    .setDescription('Show a V2 UI container demo'),
  async run(client, interaction) {
    try {
      const container = createContainer({ type: 'info' });
      addText(container, '## Novela UI Demo');
      addSection(
        container,
        'This message uses Discord Components V2 with `ContainerBuilder`.',
        createButton({
          label: 'Support Server',
          style: ButtonStyle.Link,
          url: client.config.supportServerUrl,
        }),
      );
      addSeparator(container);
      addText(container, 'Use this as a base pattern for feature UIs.');

      await interaction.reply(composeContainerMessage({ container }));
    } catch (err) {
      logger.error('[Slash] ui-demo:', err.message);
      const embed = createErrorEmbed('Unable to render UI demo.');
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
      }
    }
  },
};
