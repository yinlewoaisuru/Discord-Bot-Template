const BaseService = require('../core/BaseService');
const Giveaways = require('../database/models/Giveaways');
const { createGiveawayEmbed } = require('../utils/embedBuilder');
const { randomElement } = require('../utils/formatters');
const config = require('../config/bot.config');
const logger = require('../utils/logger');
const { isConnected } = require('../database/connection');

class GiveawayService extends BaseService {
  async create({ guildId, channelId, hostId, prize, winners, duration }) {
    const channel = await this.client.channels.fetch(channelId).catch(() => null);
    if (!channel) return { success: false, error: 'Channel not found' };

    const endsAt = new Date(Date.now() + duration);
    const embed = createGiveawayEmbed({
      title: `${config.giveaway.emoji} GIVEAWAY`,
      description: `**${prize}**\n\nReact with ${config.giveaway.emoji} to enter!\nEnds: <t:${Math.floor(endsAt.getTime() / 1000)}:R>\nHosted by: <@${hostId}>\nWinners: **${winners}**`,
    });

    const msg = await channel.send({ embeds: [embed] });
    await msg.react(config.giveaway.emoji);
    await Giveaways.create({ guildId, channelId, messageId: msg.id, hostId, prize, winners, endsAt });
    return { success: true, messageId: msg.id };
  }

  async end(messageId) {
    const gw = await Giveaways.findOne({ messageId });
    if (!gw || gw.ended) return { success: false, error: 'Not found or already ended' };

    try {
      const channel = await this.client.channels.fetch(gw.channelId);
      const msg = await channel.messages.fetch(gw.messageId);
      const reaction = msg.reactions.cache.get(config.giveaway.emoji);
      const users = reaction ? await reaction.users.fetch() : new Map();
      const entries = [...users.filter(u => !u.bot).keys()];
      const shuffled = entries.sort(() => Math.random() - 0.5);
      const winnerIds = shuffled.slice(0, gw.winners);

      gw.ended = true;
      gw.entries = entries;
      gw.winnerIds = winnerIds;
      await gw.save();

      const winnerText = winnerIds.length > 0 ? winnerIds.map(id => `<@${id}>`).join(', ') : 'No valid entries';
      const embed = createGiveawayEmbed({
        title: `${config.giveaway.endedEmoji} GIVEAWAY ENDED`,
        description: `**${gw.prize}**\n\nWinner(s): ${winnerText}\nHosted by: <@${gw.hostId}>`,
      });
      await msg.edit({ embeds: [embed] });
      if (winnerIds.length > 0) {
        await channel.send(`🎊 Congratulations ${winnerText}! You won **${gw.prize}**!`);
      }
      return { success: true, winners: winnerIds };
    } catch (err) {
      logger.error('[GiveawayService] End failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  async reroll(messageId) {
    const gw = await Giveaways.findOne({ messageId, ended: true });
    if (!gw) return { success: false, error: 'Not found' };
    const available = gw.entries.filter(id => !gw.winnerIds.includes(id));
    if (available.length === 0) return { success: false, error: 'No entries' };
    const newWinner = randomElement(available);
    gw.winnerIds = [newWinner];
    await gw.save();
    try {
      const channel = await this.client.channels.fetch(gw.channelId);
      await channel.send(`🔄 New winner: <@${newWinner}> for **${gw.prize}**!`);
    } catch (_) {}
    return { success: true, winner: newWinner };
  }

  async list(guildId) { return Giveaways.find({ guildId, ended: false }).lean(); }
  async deleteGiveaway(messageId) { return Giveaways.deleteOne({ messageId }); }

  async checkExpired() {
    if (!isConnected()) return;
    const expired = await Giveaways.find({ ended: false, endsAt: { $lte: new Date() } });
    for (const gw of expired) { await this.end(gw.messageId); }
  }
}

module.exports = GiveawayService;
