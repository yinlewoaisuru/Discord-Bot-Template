const fs = require('node:fs');
const path = require('node:path');
const logger = require('../utils/logger');
const { printBadge } = require('../console/uiLogger');

class ComponentHandler {
  constructor(client) {
    this.client = client;
  }

  async load() {
    const componentsPath = path.join(__dirname, '..', 'components');
    if (!fs.existsSync(componentsPath)) return 0;

    let count = 0;
    const types = fs.readdirSync(componentsPath).filter(f => fs.statSync(path.join(componentsPath, f)).isDirectory());

    for (const type of types) {
      const typePath = path.join(componentsPath, type);
      const files = fs.readdirSync(typePath).filter(f => f.endsWith('.js'));

      for (const file of files) {
        try {
          const component = require(path.join(typePath, file));
          if (!component.id && !component.customId) continue;
          const id = component.id || component.customId;
          this.client.components.set(id, { ...component, type });
          count++;
        } catch (err) {
          logger.error(`[ComponentHandler] Failed to load ${file}:`, err.message);
        }
      }
    }

    printBadge('COMPONENTS', `${count} components loaded`, 'cyan', 'green');
    return count;
  }
}

module.exports = ComponentHandler;
