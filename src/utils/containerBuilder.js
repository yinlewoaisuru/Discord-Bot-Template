const Discord = require('discord.js');
const {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ButtonBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  ThumbnailBuilder,
  ChannelSelectMenuBuilder,
  AttachmentBuilder,
  ButtonStyle,
  MessageFlags,
} = Discord;
const { getColorInt } = require('../config/colors.config');

function createContainer({ type = 'default', accentColor } = {}) {
  const container = new ContainerBuilder();
  container.setAccentColor(accentColor ?? getColorInt(type));
  return container;
}

function addText(container, content) {
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(String(content || '')));
  return container;
}

function addSeparator(container, divider = true) {
  container.addSeparatorComponents(new SeparatorBuilder().setDivider(Boolean(divider)));
  return container;
}

function createButton({
  customId,
  label,
  style = ButtonStyle.Secondary,
  url,
  emoji,
  disabled = false,
} = {}) {
  const button = new ButtonBuilder()
    .setStyle(style)
    .setDisabled(Boolean(disabled));

  if (url) {
    button.setURL(url);
  } else if (customId) {
    button.setCustomId(customId);
  }

  if (label) button.setLabel(label);
  if (emoji) button.setEmoji(emoji);
  return button;
}

function addSection(container, text, accessory) {
  const section = new SectionBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(String(text || '')));

  if (typeof accessory === 'string') {
    section.setThumbnailAccessory(new ThumbnailBuilder().setURL(accessory));
  } else if (accessory) {
    section.setButtonAccessory(accessory);
  }

  container.addSectionComponents(section);
  return container;
}

function addGallery(container, urls = []) {
  const gallery = new MediaGalleryBuilder();
  for (const url of urls) {
    gallery.addItems(new MediaGalleryItemBuilder().setURL(url));
  }
  container.addMediaGalleryComponents(gallery);
  return container;
}

function createChannelSelect({
  customId,
  placeholder = 'Select a channel',
  minValues = 1,
  maxValues = 1,
  channelTypes,
  disabled = false,
} = {}) {
  const menu = new ChannelSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder)
    .setMinValues(minValues)
    .setMaxValues(maxValues)
    .setDisabled(Boolean(disabled));

  if (channelTypes?.length) menu.setChannelTypes(channelTypes);
  return menu;
}

function createAttachment({ buffer, filePath, name = 'attachment.bin', description } = {}) {
  if (filePath) {
    return new AttachmentBuilder(filePath, { name, description });
  }
  return new AttachmentBuilder(buffer, { name, description });
}

function composeContainerMessage({
  container,
  files = [],
  content,
  additionalComponents = [],
} = {}) {
  const payload = {
    flags: MessageFlags.IsComponentsV2,
    components: [container, ...additionalComponents].filter(Boolean),
  };

  if (content) payload.content = content;
  if (files.length > 0) payload.files = files;
  return payload;
}

function containerFlags() {
  return { flags: MessageFlags.IsComponentsV2 };
}

module.exports = {
  createContainer,
  addText,
  addSeparator,
  createButton,
  addSection,
  addGallery,
  createChannelSelect,
  createAttachment,
  composeContainerMessage,
  containerFlags,
  ButtonStyle,
  MessageFlags,
};
