const logger = require('../utils/logger');
const { printBadge } = require('../console/uiLogger');
const { isConnected } = require('../database/connection');

class SchedulerHandler {
  constructor(client) {
    this.client = client;
    this._tasks = [];
    this._intervals = [];
  }

  init() {
    this._registerTask('giveaway-check', 15_000, async () => {
      const giveawayService = this.client.container.get('giveaway');
      if (giveawayService) await giveawayService.checkExpired();
    });

    this._registerTask('reminder-check', 30_000, async () => {
      const reminderService = this.client.container.get('reminder');
      if (reminderService) await reminderService.checkAndSend();
    });

    this._registerTask('cache-sweep', 300_000, () => {
      if (this.client.cache) this.client.cache.sweepAll();
    });

    printBadge('SCHEDULER', `${this._tasks.length} tasks registered`, 'cyan', 'green');
  }

  _registerTask(name, intervalMs, fn) {
    this._tasks.push(name);
    const id = setInterval(async () => {
      try {
        const isDbTask = name === 'giveaway-check' || name === 'reminder-check';
        if (isDbTask && !isConnected()) return;
        await fn();
      } catch (err) {
        logger.error(`[Scheduler] Task ${name} failed:`, err.message);
      }
    }, intervalMs);
    this._intervals.push(id);
  }

  destroy() {
    for (const id of this._intervals) {
      clearInterval(id);
    }
    this._intervals = [];
    this._tasks = [];
  }
}

module.exports = SchedulerHandler;
