const { Collection } = require('discord.js');

class CooldownManager {
  constructor() {
    this._cooldowns = new Collection();
    this._sweepInterval = setInterval(() => this._sweep(), 300_000);
  }

  set(commandName, userId, seconds) {
    const key = `${commandName}:${userId}`;
    this._cooldowns.set(key, Date.now() + seconds * 1000);
  }

  get(commandName, userId) {
    const key = `${commandName}:${userId}`;
    const expiry = this._cooldowns.get(key);
    if (!expiry) return 0;
    const remaining = expiry - Date.now();
    if (remaining <= 0) {
      this._cooldowns.delete(key);
      return 0;
    }
    return remaining;
  }

  has(commandName, userId) {
    return this.get(commandName, userId) > 0;
  }

  clear(commandName, userId) {
    if (userId) {
      this._cooldowns.delete(`${commandName}:${userId}`);
    } else {
      for (const key of this._cooldowns.keys()) {
        if (key.startsWith(`${commandName}:`)) {
          this._cooldowns.delete(key);
        }
      }
    }
  }

  _sweep() {
    const now = Date.now();
    for (const [key, expiry] of this._cooldowns) {
      if (expiry <= now) this._cooldowns.delete(key);
    }
  }

  destroy() {
    clearInterval(this._sweepInterval);
    this._cooldowns.clear();
  }
}

module.exports = CooldownManager;
