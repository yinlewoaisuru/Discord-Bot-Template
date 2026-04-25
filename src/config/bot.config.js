module.exports = {

  botName: 'Novela',
  prefix: '.',
  ownerIds: ['YOUR_DISCORD_USER_ID'],
  developerIds: ['DEV_USER_ID'],
  supportServerUrl: 'https://discord.gg/INVITE',
  supportServerId: 'YOUR_SUPPORT_SERVER_ID',
  inviteUrl: 'https://discord.com/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands',

  embed: {
    colors: {
      default:    '#C084FC',
      success:    '#4ADE80',
      error:      '#F87171',
      warning:    '#FBBF24',
      info:       '#60A5FA',
      loading:    '#A78BFA',
      moderation: '#F97316',
      economy:    '#F59E0B',
      leveling:   '#818CF8',
      music:      '#34D399',
      fun:        '#FB7185',
      ticket:     '#38BDF8',
      giveaway:   '#E879F9',
      automod:    '#FB923C',
      config:     '#94A3B8',
      logging:    '#6B7280',
      welcome:    '#86EFAC',
      boost:      '#F472B6',
      owner:      '#EF4444',
    },

    footer: {
      text: 'Novela Bot',
      iconUrl: null,
      includeTimestamp: true,
      includeSeparator: true,
    },

    author: {
      showBotAsAuthor: false,
      iconFromBot: true,
    },

    thumbnail: {
      showByDefault: false,
      fallbackUrl: null,
    },

    limits: {
      maxFields: 25,
      maxDescriptionLength: 4096,
      truncationSuffix: '...',
    },
  },

  status: {
    interval: 5,
    randomize: true,
    items: [
      { type: 'CUSTOM', text: (client) => `✨ ${client.guilds.cache.size.toLocaleString()} servers` },
      { type: 'CUSTOM', text: (client) => `👥 ${client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0), 0).toLocaleString()} members` },
      { type: 'CUSTOM', text: () => `.help | novela.bot` },
      { type: 'CUSTOM', text: () => `🌙 Novela v3.0` },
      { type: 'CUSTOM', text: (client) => `🔀 ${client.cluster?.id !== undefined ? `Shard ${client.cluster.id}` : 'Online'}` },
    ],
    defaultStatus: 'online',
  },

  slash: {
    guildId: null,
    deferReplyIfSlow: true,
    ephemeralErrors: true,
    generateFromPrefix: true,
    maxGeneratedFromPrefix: 90,
    maxRegistered: 100,
    excludedGeneratedCategories: ['Owner'],
  },

  commands: {
    defaultCooldown: 3,
    unknownCommandReply: false,
    deleteCommandMessage: false,
    guildOnly: true,
  },

  economy: {
    currencyName: 'gems',
    currencyEmoji: '💎',
    dailyAmount: 500,
    weeklyAmount: 2500,
    monthlyAmount: 10000,
    workMin: 100,
    workMax: 500,
    crimeMin: 200,
    crimeMax: 800,
    crimeChance: 0.5,
    robChance: 0.4,
    robMin: 0.1,
    robMax: 0.5,
    interestRate: 0.02,
    startingBalance: 0,
    maxBalance: 1_000_000_000,
    maxBank: 5_000_000_000,
  },

  leveling: {
    xpPerMessage: { min: 15, max: 40 },
    xpCooldown: 60,
    xpFormula: (level) => 5 * (level ** 2) + 50 * level + 100,
    levelUpMessage: true,
  },

  automod: {
    enabled: false,
    antispam: { enabled: false, limit: 5, interval: 5000 },
    antilink: { enabled: false, whitelist: [] },
    capsFilter: { enabled: false, threshold: 0.7 },
    massMention: { enabled: false, limit: 5 },
    badWords: { enabled: false, words: [] },
    antiraid: { enabled: false, joinThreshold: 10, joinInterval: 10000 },
    antiphish: { enabled: false },
  },

  ticket: {
    categoryName: 'Tickets',
    transcriptChannelId: null,
    maxOpenPerUser: 1,
    closeOnLeave: false,
  },

  giveaway: {
    emoji: '🎉',
    endedEmoji: '🎊',
    lastChanceEnabled: true,
    lastChanceThreshold: 5,
    lastChanceMessage: '⚠️ **LAST CHANCE** to enter!',
  },

  logging: {
    discord: {
      debug: false,
      warn: true,
      error: true,
      rateLimited: true,
    },
    console: {
      level: 'info',
      timestamps: true,
      colors: true,
    },
  },

  api: {
    enabled: true,
    port: parseInt(process.env.API_PORT, 10) || 3000,
    secret: process.env.API_SECRET || 'changeme',
  },

  database: {
    type: 'mongodb',
    mongoUri: process.env.MONGO_URI,
    sqlitePath: './data/novela.db',
  },

  maintenance: {
    enabled: false,
    message: '🔧 Novela đang bảo trì. Vui lòng quay lại sau!',
  },

  i18n: {
    defaultLocale: 'vi',
    fallbackLocale: 'en',
    supportedLocales: ['vi', 'en', 'ja', 'zh'],
  },
};
