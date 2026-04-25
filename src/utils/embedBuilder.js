const { EmbedBuilder } = require('discord.js');
const config = require('../config/bot.config');

const { colors, footer, limits } = config.embed;

function resolveColor(type = 'default') {
  if (typeof type === 'string' && type.startsWith('#')) return type;
  return colors[type] ?? colors.default;
}

function createEmbed({
  type = 'default',
  color,
  title,
  description,
  thumbnail,
  image,
  fields = [],
  author: authorOpt,
  footerOverride,
  timestamp,
  url,
} = {}) {
  const embed = new EmbedBuilder();

  embed.setColor(color ? color : resolveColor(type));

  if (title) embed.setTitle(String(title).slice(0, 256));
  if (url) embed.setURL(url);
  if (description) {
    embed.setDescription(String(description).slice(0, limits.maxDescriptionLength));
  }
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (image) embed.setImage(image);

  if (fields.length > 0) {
    const safeFields = fields.slice(0, limits.maxFields).map((field) => ({
      name: String(field.name || '\u200b').slice(0, 256),
      value: String(field.value || '\u200b').slice(0, 1024),
      inline: Boolean(field.inline),
    }));
    embed.addFields(safeFields);
  }

  if (authorOpt) {
    embed.setAuthor({
      name: String(authorOpt.name || config.botName).slice(0, 256),
      iconURL: authorOpt.iconURL ?? undefined,
      url: authorOpt.url ?? undefined,
    });
  }

  if (footerOverride) {
    embed.setFooter({
      text: String(footerOverride.text || footer.text).slice(0, 2048),
      iconURL: footerOverride.iconURL ?? footer.iconUrl ?? undefined,
    });
  } else if (footer.text) {
    embed.setFooter({
      text: footer.text,
      iconURL: footer.iconUrl ?? undefined,
    });
  }

  const useTimestamp = timestamp !== undefined ? timestamp : footer.includeTimestamp;
  if (useTimestamp) embed.setTimestamp();

  return embed;
}

const createErrorEmbed = (description, title = 'Error') =>
  createEmbed({ type: 'error', title, description });

const createSuccessEmbed = (description, title = 'Success') =>
  createEmbed({ type: 'success', title, description });

const createWarningEmbed = (description, title = 'Warning') =>
  createEmbed({ type: 'warning', title, description });

const createInfoEmbed = (description, title = 'Info') =>
  createEmbed({ type: 'info', title, description });

const createLoadingEmbed = (description = 'Processing...', title = 'Please wait') =>
  createEmbed({ type: 'loading', title, description });

const createModEmbed = (opts) =>
  createEmbed({ type: 'moderation', ...opts });

const createEconomyEmbed = (opts) =>
  createEmbed({ type: 'economy', ...opts });

const createLevelEmbed = (opts) =>
  createEmbed({ type: 'leveling', ...opts });

const createMusicEmbed = (opts) =>
  createEmbed({ type: 'music', ...opts });

const createGiveawayEmbed = (opts) =>
  createEmbed({ type: 'giveaway', ...opts });

const getColor = (type = 'default') => resolveColor(type);

module.exports = {
  createEmbed,
  createErrorEmbed,
  createSuccessEmbed,
  createWarningEmbed,
  createInfoEmbed,
  createLoadingEmbed,
  createModEmbed,
  createEconomyEmbed,
  createLevelEmbed,
  createMusicEmbed,
  createGiveawayEmbed,
  getColor,
  resolveColor,
};
