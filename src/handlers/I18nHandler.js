const { loadLocales, getLocales } = require('../i18n');
const { printBadge } = require('../console/uiLogger');

class I18nHandler {
  constructor(client) {
    this.client = client;
  }

  init() {
    loadLocales();
    const locales = getLocales();
    printBadge('I18N', `${locales.length} languages loaded: ${locales.join(', ')}`, 'cyan', 'green');
  }
}

module.exports = I18nHandler;
