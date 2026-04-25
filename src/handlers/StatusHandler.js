const { ActivityType } = require('discord.js');
const config = require('../config/bot.config');
const logger = require('../utils/logger');

class StatusHandler {
  constructor(client) {
    this.client = client;
    this._interval = null;
    this._index = 0;
  }

  async start() {
    const items = config.status.items;
    if (!items || items.length === 0) return;

    this._setStatus();
    this._interval = setInterval(() => this._setStatus(), config.status.interval * 1000);
  }

  stop() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  _setStatus() {
    try {
      const items = config.status.items;
      if (config.status.randomize) {
        this._index = Math.floor(Math.random() * items.length);
      } else {
        this._index = (this._index + 1) % items.length;
      }

      const item = items[this._index];
      const text = typeof item.text === 'function' ? item.text(this.client) : item.text;

      this.client.user.setPresence({
        status: config.status.defaultStatus,
        activities: [{ name: text, type: ActivityType.Custom }],
      });
    } catch (err) {
      logger.error('[StatusHandler] Set status failed:', err.message);
    }
  }
}

module.exports = StatusHandler;
