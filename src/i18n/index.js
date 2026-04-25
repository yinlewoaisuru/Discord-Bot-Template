const fs = require('node:fs');
const path = require('node:path');
const config = require('../config/bot.config');
const logger = require('../utils/logger');

const locales = new Map();

function loadLocales() {
  const dir = path.join(__dirname);
  for (const locale of config.i18n.supportedLocales) {
    const filePath = path.join(dir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        locales.set(locale, flattenObject(data));
        logger.info(`[i18n] Loaded locale: ${locale}`);
      } catch (err) {
        logger.error(`[i18n] Failed to load ${locale}:`, err.message);
      }
    }
  }
}

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

function t(key, locale, replacements = {}) {
  const lang = locale || config.i18n.defaultLocale;
  const strings = locales.get(lang) || locales.get(config.i18n.fallbackLocale) || new Map();
  let text = strings[key] || locales.get(config.i18n.fallbackLocale)?.[key] || key;

  for (const [placeholder, value] of Object.entries(replacements)) {
    text = text.replace(new RegExp(`{${placeholder}}`, 'g'), String(value));
  }

  return text;
}

function getLocales() {
  return [...locales.keys()];
}

loadLocales();

module.exports = { t, loadLocales, getLocales };
