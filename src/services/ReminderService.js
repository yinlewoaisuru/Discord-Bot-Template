const BaseService = require('../core/BaseService');
const Reminders = require('../database/models/Reminders');
const logger = require('../utils/logger');
const { isConnected } = require('../database/connection');

class ReminderService extends BaseService {
  async create(userId, channelId, guildId, message, remindAt) {
    return Reminders.create({ userId, channelId, guildId, message, remindAt });
  }

  async getForUser(userId) {
    return Reminders.find({ userId, completed: false }).sort({ remindAt: 1 }).lean();
  }

  async checkAndSend() {
    if (!isConnected()) return;
    const due = await Reminders.find({ completed: false, remindAt: { $lte: new Date() } });
    for (const reminder of due) {
      try {
        const channel = await this.client.channels.fetch(reminder.channelId).catch(() => null);
        if (channel) {
          await channel.send(`🔔 <@${reminder.userId}>, reminder: **${reminder.message}**`);
        }
        reminder.completed = true;
        await reminder.save();
      } catch (err) {
        logger.error('[ReminderService] Send failed:', err.message);
      }
    }
  }

  async delete(reminderId, userId) {
    return Reminders.deleteOne({ _id: reminderId, userId });
  }
}

module.exports = ReminderService;
