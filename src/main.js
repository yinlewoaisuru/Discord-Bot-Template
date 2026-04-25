require('dotenv').config();
const NovelaClient = require('./core/NovelaClient');
const { printBanner } = require('./console/uiLogger');
const CooldownManager = require('./utils/cooldownManager');
const DatabaseHandler = require('./handlers/DatabaseHandler');
const I18nHandler = require('./handlers/I18nHandler');
const CacheHandler = require('./handlers/CacheHandler');
const CommandHandler = require('./handlers/CommandHandler');
const SlashHandler = require('./handlers/SlashHandler');
const ComponentHandler = require('./handlers/ComponentHandler');
const SchedulerHandler = require('./handlers/SchedulerHandler');
const EventHandler = require('./handlers/EventHandler');
const AuthMiddleware = require('./middleware/AuthMiddleware');
const CooldownMiddleware = require('./middleware/CooldownMiddleware');
const PermissionMiddleware = require('./middleware/PermissionMiddleware');
const GuildOnlyMiddleware = require('./middleware/GuildOnlyMiddleware');
const NSFWMiddleware = require('./middleware/NSFWMiddleware');
const MaintenanceMiddleware = require('./middleware/MaintenanceMiddleware');
const LogMiddleware = require('./middleware/LogMiddleware');
const ModerationService = require('./services/ModerationService');
const EconomyService = require('./services/EconomyService');
const LevelingService = require('./services/LevelingService');
const AutomodService = require('./services/AutomodService');
const GiveawayService = require('./services/GiveawayService');
const TicketService = require('./services/TicketService');
const WelcomeService = require('./services/WelcomeService');
const LogService = require('./services/LogService');
const ReminderService = require('./services/ReminderService');
const AFKService = require('./services/AFKService');
const SnipeService = require('./services/SnipeService');
const BlacklistService = require('./services/BlacklistService');
const StatsService = require('./services/StatsService');
const logger = require('./utils/logger');
const { printSep } = require('./console/uiLogger');

async function bootstrap() {
  printBanner();

  const client = new NovelaClient();
  client.cooldowns = new CooldownManager();
  client.pipeline
    .clear()
    .use(MaintenanceMiddleware)
    .use(AuthMiddleware)
    .use(GuildOnlyMiddleware)
    .use(NSFWMiddleware)
    .use(PermissionMiddleware)
    .use(CooldownMiddleware)
    .use(LogMiddleware);

  const dbHandler = new DatabaseHandler(client);
  await dbHandler.connect();

  const i18nHandler = new I18nHandler(client);
  i18nHandler.init();

  const cacheHandler = new CacheHandler(client);
  cacheHandler.init();

  client.container.register('moderation', new ModerationService(client));
  client.container.register('economy', new EconomyService(client));
  client.container.register('leveling', new LevelingService(client));
  client.container.register('automod', new AutomodService(client));
  client.container.register('giveaway', new GiveawayService(client));
  client.container.register('ticket', new TicketService(client));
  client.container.register('welcome', new WelcomeService(client));
  client.container.register('log', new LogService(client));
  client.container.register('reminder', new ReminderService(client));
  client.container.register('afk', new AFKService(client));
  client.container.register('snipe', new SnipeService(client));
  client.container.register('blacklist', new BlacklistService(client));
  client.container.register('stats', new StatsService(client));

  printSep('gray');

  const commandHandler = new CommandHandler(client);
  await commandHandler.load();
  client.commandHandler = commandHandler;

  const slashHandler = new SlashHandler(client);
  await slashHandler.load();
  client.slashHandler = slashHandler;

  const componentHandler = new ComponentHandler(client);
  await componentHandler.load();

  const schedulerHandler = new SchedulerHandler(client);
  schedulerHandler.init();
  client.scheduler = schedulerHandler;

  const eventHandler = new EventHandler(client);
  await eventHandler.load();

  printSep('gray');

  await client.login(process.env.TOKEN);

  await slashHandler.register();

  if (client.config.api.enabled) {
    try {
      const { startApiServer } = require('./api/server');
      startApiServer(client);
    } catch (err) {
      logger.warn('[API] API server failed to start:', err.message);
    }
  }

  process.on('unhandledRejection', (err) => {
    logger.error('[Unhandled Rejection]', err?.message || err);
  });

  process.on('uncaughtException', (err) => {
    logger.error('[Uncaught Exception]', err.message);
  });

  process.on('SIGINT', async () => {
    logger.info('[Shutdown] Graceful shutdown initiated...');
    client.statusHandler?.stop();
    client.scheduler?.destroy();
    client.cooldowns?.destroy();
    await dbHandler.disconnect();
    client.destroy();
    process.exit(0);
  });
}

bootstrap().catch((err) => {
  logger.error('[FATAL] Bootstrap failed:', err?.stack || err?.message || err);
  process.exit(1);
});
