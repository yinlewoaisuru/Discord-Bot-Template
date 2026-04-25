const { connect, disconnect } = require('../database/connection');
const logger = require('../utils/logger');
const { printBadge } = require('../console/uiLogger');

class DatabaseHandler {
  constructor(client) {
    this.client = client;
  }

  async connect() {
    const success = await connect();
    if (success) {
      printBadge('DATABASE', 'MongoDB connected', 'green', 'green');
    } else {
      printBadge('DATABASE', 'MongoDB connection skipped/failed', 'yellow', 'yellow');
    }
    return success;
  }

  async disconnect() {
    await disconnect();
  }
}

module.exports = DatabaseHandler;
