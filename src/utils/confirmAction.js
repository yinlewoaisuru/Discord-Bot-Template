const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { createWarningEmbed } = require('./embedBuilder');
const { CONFIRM_TIMEOUT } = require('../config/constants.config');

async function confirmAction(interaction, {
  content,
  embed,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  timeout = CONFIRM_TIMEOUT,
  ephemeral = false,
} = {}) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('confirm_yes')
      .setLabel(confirmLabel)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('confirm_no')
      .setLabel(cancelLabel)
      .setStyle(ButtonStyle.Danger),
  );

  const payload = {
    components: [row],
    ephemeral,
  };

  if (embed) {
    payload.embeds = [embed];
  } else if (content) {
    payload.content = content;
  } else {
    payload.embeds = [createWarningEmbed('Bạn có chắc chắn muốn thực hiện hành động này?')];
  }

  let msg;
  if (interaction.deferred || interaction.replied) {
    msg = await interaction.editReply(payload);
  } else {
    msg = await interaction.reply({ ...payload, fetchReply: true });
  }

  try {
    const response = await msg.awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => i.user.id === (interaction.user?.id ?? interaction.author?.id),
      time: timeout,
    });

    const confirmed = response.customId === 'confirm_yes';

    await response.update({
      components: [],
    });

    return { confirmed, interaction: response };
  } catch (_) {
    try {
      await msg.edit({ components: [] });
    } catch (__) {}
    return { confirmed: false, interaction: null };
  }
}

module.exports = { confirmAction };
