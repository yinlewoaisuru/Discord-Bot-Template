const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { PAGINATION_TIMEOUT } = require('../config/constants.config');

async function paginate(interaction, pages, options = {}) {
  if (!pages || pages.length === 0) return;
  if (pages.length === 1) {
    const payload = typeof pages[0] === 'string' ? { content: pages[0] } : { embeds: [pages[0]] };
    if (interaction.deferred || interaction.replied) {
      return interaction.editReply(payload);
    }
    return interaction.reply(payload);
  }

  let currentPage = 0;
  const timeout = options.timeout || PAGINATION_TIMEOUT;

  const getRow = (disabled = false) => {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('paginate_first')
        .setEmoji('⏮️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled || currentPage === 0),
      new ButtonBuilder()
        .setCustomId('paginate_prev')
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled || currentPage === 0),
      new ButtonBuilder()
        .setCustomId('paginate_counter')
        .setLabel(`${currentPage + 1}/${pages.length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('paginate_next')
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled || currentPage === pages.length - 1),
      new ButtonBuilder()
        .setCustomId('paginate_last')
        .setEmoji('⏭️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled || currentPage === pages.length - 1),
    );
  };

  const getPayload = (disabled = false) => {
    const page = pages[currentPage];
    const payload = typeof page === 'string'
      ? { content: page, embeds: [], components: [getRow(disabled)] }
      : { content: '', embeds: [page], components: [getRow(disabled)] };
    return payload;
  };

  let msg;
  if (interaction.deferred || interaction.replied) {
    msg = await interaction.editReply(getPayload());
  } else {
    msg = await interaction.reply({ ...getPayload(), fetchReply: true });
  }

  const collector = msg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (i) => i.user.id === (interaction.user?.id ?? interaction.author?.id),
    time: timeout,
  });

  collector.on('collect', async (i) => {
    try {
      switch (i.customId) {
        case 'paginate_first': currentPage = 0; break;
        case 'paginate_prev':  currentPage = Math.max(0, currentPage - 1); break;
        case 'paginate_next':  currentPage = Math.min(pages.length - 1, currentPage + 1); break;
        case 'paginate_last':  currentPage = pages.length - 1; break;
      }
      await i.update(getPayload());
    } catch (_) {}
  });

  collector.on('end', async () => {
    try {
      await msg.edit(getPayload(true));
    } catch (_) {}
  });

  return msg;
}

module.exports = { paginate };
