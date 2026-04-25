const { SlashCommandBuilder, ChannelType } = require('discord.js');
const {
  createContainer,
  addText,
  addSection,
  createChannelSelect,
  composeContainerMessage,
} = require('../../utils/containerBuilder');
const { createErrorEmbed } = require('../../utils/embedBuilder');
const logger = require('../../utils/logger');

module.exports = {
  category: 'Components',
  data: new SlashCommandBuilder()
    .setName('menu-demo')
    .setDescription('Show a channel select menu demo'),
  async run(client, interaction) {
    try {
      const container = createContainer({ type: 'config' });
      addText(container, '## Channel Menu Demo');
      addSection(container, 'Pick a text channel using the selector below.');

      const selectMenu = createChannelSelect({
        customId: 'menu-demo-channel',
        placeholder: 'Choose a channel',
        channelTypes: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
      });

      await interaction.reply(
        composeContainerMessage({
          container,
          additionalComponents: [selectMenu],
        }),
      );
    } catch (err) {
      logger.error('[Slash] menu-demo:', err.message);
      const embed = createErrorEmbed('Unable to render menu demo.');
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
      }
    }
  },
};
