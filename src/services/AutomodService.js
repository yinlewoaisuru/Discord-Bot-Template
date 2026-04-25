const BaseService = require('../core/BaseService');
const Automod = require('../database/models/Automod');
const RateLimitTracker = require('../utils/rateLimit');
const logger = require('../utils/logger');

class AutomodService extends BaseService {
  constructor(client) {
    super(client);
    this._spamTracker = new RateLimitTracker();
    this._joinTracker = new RateLimitTracker();
    this._phishDomains = new Set(['discord.gift.fake', 'discordnitro.gift']);
  }

  async getConfig(guildId) {
    let config = await Automod.findOne({ guildId });
    if (!config) config = await Automod.create({ guildId });
    return config;
  }

  async updateConfig(guildId, data) {
    return Automod.findOneAndUpdate({ guildId }, { $set: data }, { new: true, upsert: true });
  }

  async processMessage(message) {
    if (!message.guild || message.author.bot) return [];
    const config = await this.getConfig(message.guild.id);
    const actions = [];

    if (config.exemptRoles?.some(r => message.member?.roles.cache.has(r))) return [];
    if (config.exemptChannels?.includes(message.channel.id)) return [];

    if (config.antispam?.enabled) {
      const result = this._spamTracker.check(`spam:${message.author.id}:${message.guild.id}`, config.antispam.limit, config.antispam.interval);
      if (result.limited) {
        actions.push({ type: 'antispam', action: config.antispam.action || 'mute' });
      }
    }

    if (config.antilink?.enabled) {
      const urlRegex = /https?:\/\/[^\s]+/gi;
      if (urlRegex.test(message.content)) {
        const whitelist = config.antilink.whitelist || [];
        const hasWhitelisted = whitelist.some(domain => message.content.includes(domain));
        if (!hasWhitelisted) {
          actions.push({ type: 'antilink', action: config.antilink.action || 'delete' });
        }
      }
    }

    if (config.capsFilter?.enabled) {
      const content = message.content;
      if (content.length >= (config.capsFilter.minLength || 10)) {
        const caps = content.replace(/[^A-Z]/g, '').length;
        const ratio = caps / content.length;
        if (ratio >= (config.capsFilter.threshold || 0.7)) {
          actions.push({ type: 'capsFilter', action: config.capsFilter.action || 'delete' });
        }
      }
    }

    if (config.massMention?.enabled) {
      const mentionCount = message.mentions.users.size + message.mentions.roles.size;
      if (mentionCount >= (config.massMention.limit || 5)) {
        actions.push({ type: 'massMention', action: config.massMention.action || 'mute' });
      }
    }

    if (config.badWords?.enabled && config.badWords.words?.length > 0) {
      const lower = message.content.toLowerCase();
      const found = config.badWords.words.some(w => lower.includes(w.toLowerCase()));
      if (found) {
        actions.push({ type: 'badWords', action: config.badWords.action || 'delete' });
      }
    }

    if (config.antiphish?.enabled) {
      const urls = message.content.match(/https?:\/\/[^\s]+/gi) || [];
      for (const url of urls) {
        try {
          const domain = new URL(url).hostname;
          if (this._phishDomains.has(domain)) {
            actions.push({ type: 'antiphish', action: config.antiphish.action || 'ban' });
            break;
          }
        } catch (_) {}
      }
    }

    return actions;
  }

  async executeActions(message, actions) {
    for (const action of actions) {
      try {
        if (action.action === 'delete') {
          if (message.deletable) await message.delete();
        } else if (action.action === 'mute') {
          await message.member?.timeout(600_000, `Automod: ${action.type}`);
          if (message.deletable) await message.delete();
        } else if (action.action === 'kick') {
          if (message.member?.kickable) await message.member.kick(`Automod: ${action.type}`);
        } else if (action.action === 'ban') {
          if (message.member?.bannable) await message.member.ban({ reason: `Automod: ${action.type}` });
        }
      } catch (err) {
        logger.error(`[AutomodService] Action failed (${action.type}):`, err.message);
      }
    }
  }

  processJoin(member) {
    const result = this._joinTracker.check(`raid:${member.guild.id}`, 10, 10000);
    return result.limited;
  }
}

module.exports = AutomodService;
