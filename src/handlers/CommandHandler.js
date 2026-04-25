const fs = require('node:fs');
const path = require('node:path');
const logger = require('../utils/logger');
const { printBadge } = require('../console/uiLogger');

class CommandHandler {
  constructor(client) {
    this.client = client;
  }

  async load() {
    const commandsPath = path.join(__dirname, '..', 'commands');
    if (!fs.existsSync(commandsPath)) return 0;

    let count = 0;
    const categories = fs.readdirSync(commandsPath).filter(f => fs.statSync(path.join(commandsPath, f)).isDirectory());

    for (const category of categories) {
      const catPath = path.join(commandsPath, category);
      const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));

      for (const file of files) {
        try {
          const command = require(path.join(catPath, file));
          if (!command.name) continue;

          command.category = command.category || category;
          this.client.commands.set(command.name, command);

          if (command.aliases?.length) {
            for (const alias of command.aliases) {
              this.client.aliases.set(alias, command.name);
            }
          }
          count++;
        } catch (err) {
          logger.error(`[CommandHandler] Failed to load ${file}:`, err.message);
        }
      }
    }

    printBadge('COMMANDS', `${count} prefix commands loaded`, 'cyan', 'green');
    return count;
  }

  reload(commandName) {
    const command = this.client.commands.get(commandName);
    if (!command) return false;

    const commandsPath = path.join(__dirname, '..', 'commands');
    const categories = fs.readdirSync(commandsPath).filter(f => fs.statSync(path.join(commandsPath, f)).isDirectory());

    for (const category of categories) {
      const filePath = path.join(commandsPath, category, `${commandName}.js`);
      if (fs.existsSync(filePath)) {
        delete require.cache[require.resolve(filePath)];
        const reloaded = require(filePath);
        reloaded.category = reloaded.category || category;
        this.client.commands.set(reloaded.name, reloaded);
        return true;
      }
    }
    return false;
  }
}

module.exports = CommandHandler;
