const { Events } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  execute(oldState, newState, client) {
    if (oldState.member?.user?.bot) return;

    if (!oldState.channelId && newState.channelId) {
      logger.debug(`[Voice] ${newState.member.user.tag} joined ${newState.channel.name}`);
    } else if (oldState.channelId && !newState.channelId) {
      logger.debug(`[Voice] ${oldState.member.user.tag} left ${oldState.channel.name}`);
    } else if (oldState.channelId !== newState.channelId) {
      logger.debug(`[Voice] ${newState.member.user.tag} moved channels`);
    }
  },
};
