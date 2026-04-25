const fs = require('node:fs');
const path = require('node:path');
const logger = require('../utils/logger');
const { printBadge } = require('../console/uiLogger');

class EventHandler {
  constructor(client) {
    this.client = client;
  }

  async load() {
    const eventsPath = path.join(__dirname, '..', 'events');
    if (!fs.existsSync(eventsPath)) return 0;

    let count = 0;
    const categories = fs.readdirSync(eventsPath).filter(f => fs.statSync(path.join(eventsPath, f)).isDirectory());

    for (const category of categories) {
      const catPath = path.join(eventsPath, category);
      const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));

      for (const file of files) {
        try {
          const event = require(path.join(catPath, file));
          if (!event.name) continue;

          if (event.once) {
            this.client.once(event.name, (...args) => event.execute(...args, this.client));
          } else {
            this.client.on(event.name, (...args) => event.execute(...args, this.client));
          }
          count++;
        } catch (err) {
          logger.error(`[EventHandler] Failed to load ${file}:`, err.message);
        }
      }
    }

    printBadge('EVENTS', `${count} events loaded`, 'cyan', 'green');
    return count;
  }
}

module.exports = EventHandler;
