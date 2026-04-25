const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('../config/bot.config');

let connected = false;

async function connect() {
  const uri = config.database.mongoUri;
  if (!uri) {
    logger.warn('[Database] No MONGO_URI provided, skipping MongoDB connection.');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    connected = true;
    logger.info('[Database] MongoDB connected successfully.');

    mongoose.connection.on('error', (err) => {
      logger.error('[Database] MongoDB error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      connected = false;
      logger.warn('[Database] MongoDB disconnected.');
    });

    return true;
  } catch (err) {
    logger.error('[Database] MongoDB connection failed:', err.message);
    return false;
  }
}

async function disconnect() {
  try {
    await mongoose.disconnect();
    connected = false;
    logger.info('[Database] MongoDB disconnected.');
  } catch (err) {
    logger.error('[Database] Disconnect error:', err.message);
  }
}

function isConnected() {
  return connected && mongoose.connection.readyState === 1;
}

module.exports = { connect, disconnect, isConnected };
