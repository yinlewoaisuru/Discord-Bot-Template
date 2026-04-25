const logger = require('../utils/logger');

async function LogMiddleware(context, next) {
  const { command, message, interaction } = context;
  const userId = message?.author?.id ?? interaction?.user?.id;
  const guildId = message?.guild?.id ?? interaction?.guild?.id ?? 'DM';
  const start = Date.now();

  await next();

  const duration = Date.now() - start;
  logger.debug(`[CMD] ${command.name} | User: ${userId} | Guild: ${guildId} | ${duration}ms`);
}

module.exports = LogMiddleware;
