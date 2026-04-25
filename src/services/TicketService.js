const BaseService = require('../core/BaseService');
const Tickets = require('../database/models/Tickets');
const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embedBuilder');
const { generateId } = require('../utils/crypto');
const config = require('../config/bot.config');
const logger = require('../utils/logger');

class TicketService extends BaseService {
  async create(guild, user, subject = 'Support') {
    const openCount = await Tickets.countDocuments({ guildId: guild.id, userId: user.id, status: 'open' });
    if (openCount >= config.ticket.maxOpenPerUser) return { success: false, error: 'maxOpen' };

    const ticketId = generateId(6);
    const channelName = `ticket-${user.username}-${ticketId}`.toLowerCase().replace(/[^a-z0-9-]/g, '');

    try {
      const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          { id: guild.members.me.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] },
        ],
      });

      await Tickets.create({ guildId: guild.id, channelId: channel.id, userId: user.id, ticketId, subject });

      const embed = createEmbed({
        type: 'ticket',
        title: '🎫 Ticket Created',
        description: `Welcome ${user}!\n\n**Subject:** ${subject}\n**Ticket ID:** \`${ticketId}\`\n\nSupport team will be with you shortly.`,
      });
      await channel.send({ embeds: [embed] });

      return { success: true, channel, ticketId };
    } catch (err) {
      logger.error('[TicketService] Create failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  async close(channelId, closedBy) {
    const ticket = await Tickets.findOne({ channelId, status: 'open' });
    if (!ticket) return { success: false, error: 'notFound' };

    ticket.status = 'closed';
    ticket.closedBy = closedBy;
    ticket.closedAt = new Date();
    await ticket.save();

    return { success: true, ticket };
  }

  async addUser(channelId, userId, guild) {
    try {
      const channel = guild.channels.cache.get(channelId);
      if (!channel) return { success: false, error: 'channelNotFound' };
      await channel.permissionOverwrites.edit(userId, { ViewChannel: true, SendMessages: true });
      await Tickets.findOneAndUpdate({ channelId }, { $addToSet: { addedUsers: userId } });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async removeUser(channelId, userId, guild) {
    try {
      const channel = guild.channels.cache.get(channelId);
      if (!channel) return { success: false, error: 'channelNotFound' };
      await channel.permissionOverwrites.delete(userId);
      await Tickets.findOneAndUpdate({ channelId }, { $pull: { addedUsers: userId } });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async generateTranscript(channel, maxMessages = 500) {
    try {
      const messages = await channel.messages.fetch({ limit: maxMessages });
      const sorted = [...messages.values()].reverse();
      const lines = sorted.map(m => `[${m.createdAt.toISOString()}] ${m.author.tag}: ${m.content || '[embed/attachment]'}`);
      return lines.join('\n');
    } catch (err) {
      return null;
    }
  }
}

module.exports = TicketService;
