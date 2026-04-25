const { Events } = require('discord.js');
const StatusHandler = require('../../handlers/StatusHandler');
const { printStartupSummary } = require('../../console/startupLog');
const { printBadge } = require('../../console/uiLogger');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    printStartupSummary(client);

    const statusHandler = new StatusHandler(client);
    client.statusHandler = statusHandler;
    await statusHandler.start();

    printBadge('STATUS', 'Rotating presence started', 'purple', 'green');
    printBadge('READY', `${client.user.tag} is online and ready!`, 'green', 'white');

    const totalMembers = client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0), 0);
    logger.info(`[Ready] ${client.user.tag} — ${client.guilds.cache.size} guilds | ${totalMembers} members`);
  },
};
