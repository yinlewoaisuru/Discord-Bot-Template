const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const ServiceContainer = require('./ServiceContainer');
const EventBus = require('./EventBus');
const Pipeline = require('./Pipeline');
const config = require('../config/bot.config');

class NovelaClient extends Client {
  constructor(clusterData) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
      ],
      allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true,
      },
      failIfNotExists: false,
    });

    this.config = config;
    this.commands = new Collection();
    this.slash = new Collection();
    this.aliases = new Collection();
    this.components = new Collection();
    this.cooldowns = new Collection();
    this.container = new ServiceContainer();
    this.eventBus = new EventBus();
    this.pipeline = new Pipeline();
    this.cluster = clusterData || null;
    this.maintenanceMode = config.maintenance.enabled;
    this.bootTimestamp = Date.now();
  }

  get uptime() {
    return Date.now() - this.bootTimestamp;
  }
}

module.exports = NovelaClient;
