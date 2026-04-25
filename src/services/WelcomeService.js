const BaseService = require('../core/BaseService');
const GuildRepo = require('../database/repositories/GuildRepo');
const { createEmbed } = require('../utils/embedBuilder');
const logger = require('../utils/logger');

class WelcomeService extends BaseService {
  async sendWelcome(member) {
    try {
      const config = await GuildRepo.get(member.guild.id);
      if (!config.welcomeChannel) return;
      const channel = member.guild.channels.cache.get(config.welcomeChannel);
      if (!channel) return;

      const text = (config.welcomeMessage || 'Welcome {user} to **{server}**! You are member #{count}.')
        .replace(/{user}/g, member.toString())
        .replace(/{username}/g, member.user.username)
        .replace(/{server}/g, member.guild.name)
        .replace(/{count}/g, member.guild.memberCount);

      const embed = createEmbed({ type: 'welcome', title: '👋 Welcome!', description: text, thumbnail: member.user.displayAvatarURL({ size: 256 }) });
      await channel.send({ embeds: [embed] });
    } catch (err) {
      logger.error('[WelcomeService] Welcome failed:', err.message);
    }
  }

  async sendLeave(member) {
    try {
      const config = await GuildRepo.get(member.guild.id);
      if (!config.leaveChannel) return;
      const channel = member.guild.channels.cache.get(config.leaveChannel);
      if (!channel) return;

      const text = (config.leaveMessage || '**{username}** has left the server. We now have {count} members.')
        .replace(/{user}/g, member.toString())
        .replace(/{username}/g, member.user.username)
        .replace(/{server}/g, member.guild.name)
        .replace(/{count}/g, member.guild.memberCount);

      const embed = createEmbed({ type: 'welcome', title: '🚪 Goodbye!', description: text });
      await channel.send({ embeds: [embed] });
    } catch (err) {
      logger.error('[WelcomeService] Leave failed:', err.message);
    }
  }

  async sendBoost(member) {
    try {
      const config = await GuildRepo.get(member.guild.id);
      if (!config.boostChannel) return;
      const channel = member.guild.channels.cache.get(config.boostChannel);
      if (!channel) return;

      const text = (config.boostMessage || '💜 **{username}** just boosted the server! We now have {boosts} boosts!')
        .replace(/{user}/g, member.toString())
        .replace(/{username}/g, member.user.username)
        .replace(/{boosts}/g, member.guild.premiumSubscriptionCount);

      const embed = createEmbed({ type: 'boost', title: '💜 Server Boosted!', description: text });
      await channel.send({ embeds: [embed] });
    } catch (err) {
      logger.error('[WelcomeService] Boost failed:', err.message);
    }
  }
}

module.exports = WelcomeService;
