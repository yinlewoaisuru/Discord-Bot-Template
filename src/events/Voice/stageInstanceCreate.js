const { Events } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.StageInstanceCreate,
  once: false,
  execute(stageInstance) {
    logger.debug(`[Stage] Created in ${stageInstance.guild?.name}: ${stageInstance.topic}`);
  },
};
