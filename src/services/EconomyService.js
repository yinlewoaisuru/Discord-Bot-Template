const BaseService = require('../core/BaseService');
const EconomyRepo = require('../database/repositories/EconomyRepo');
const config = require('../config/bot.config');
const { randomInt } = require('../utils/formatters');

class EconomyService extends BaseService {
  async getBalance(userId, guildId) {
    return EconomyRepo.get(userId, guildId);
  }

  async addMoney(userId, guildId, amount, target = 'wallet') {
    return EconomyRepo.addBalance(userId, guildId, amount, target);
  }

  async removeMoney(userId, guildId, amount, target = 'wallet') {
    return EconomyRepo.removeBalance(userId, guildId, amount, target);
  }

  async transfer(fromId, toId, guildId, amount) {
    const sender = await EconomyRepo.get(fromId, guildId);
    if (sender.wallet < amount) return { success: false, error: 'notEnough' };
    await EconomyRepo.transfer(fromId, toId, guildId, amount);
    return { success: true };
  }

  async claimDaily(userId, guildId) {
    return this._claimReward(userId, guildId, 'lastDaily', config.economy.dailyAmount, 86_400_000);
  }

  async claimWeekly(userId, guildId) {
    return this._claimReward(userId, guildId, 'lastWeekly', config.economy.weeklyAmount, 604_800_000);
  }

  async claimMonthly(userId, guildId) {
    return this._claimReward(userId, guildId, 'lastMonthly', config.economy.monthlyAmount, 2_592_000_000);
  }

  async work(userId, guildId) {
    const eco = await EconomyRepo.get(userId, guildId);
    if (eco.lastWork && Date.now() - eco.lastWork.getTime() < 3_600_000) {
      return { success: false, cooldown: eco.lastWork.getTime() + 3_600_000 - Date.now() };
    }
    const amount = randomInt(config.economy.workMin, config.economy.workMax);
    await EconomyRepo.addBalance(userId, guildId, amount);
    await EconomyRepo.update(userId, guildId, { lastWork: new Date() });
    return { success: true, amount };
  }

  async crime(userId, guildId) {
    const eco = await EconomyRepo.get(userId, guildId);
    if (eco.lastCrime && Date.now() - eco.lastCrime.getTime() < 7_200_000) {
      return { success: false, cooldown: eco.lastCrime.getTime() + 7_200_000 - Date.now() };
    }
    const won = Math.random() < config.economy.crimeChance;
    const amount = randomInt(config.economy.crimeMin, config.economy.crimeMax);
    if (won) {
      await EconomyRepo.addBalance(userId, guildId, amount);
    } else {
      await EconomyRepo.removeBalance(userId, guildId, Math.floor(amount * 0.5));
    }
    await EconomyRepo.update(userId, guildId, { lastCrime: new Date() });
    return { success: true, won, amount: won ? amount : Math.floor(amount * 0.5) };
  }

  async rob(robberId, victimId, guildId) {
    const robber = await EconomyRepo.get(robberId, guildId);
    const victim = await EconomyRepo.get(victimId, guildId);
    if (robber.lastRob && Date.now() - robber.lastRob.getTime() < 7_200_000) {
      return { success: false, cooldown: robber.lastRob.getTime() + 7_200_000 - Date.now() };
    }
    if (victim.wallet < 100) return { success: false, error: 'targetPoor' };

    const won = Math.random() < config.economy.robChance;
    const amount = Math.floor(victim.wallet * (config.economy.robMin + Math.random() * (config.economy.robMax - config.economy.robMin)));

    if (won) {
      await EconomyRepo.transfer(victimId, robberId, guildId, amount);
    } else {
      const fine = Math.floor(amount * 0.5);
      await EconomyRepo.removeBalance(robberId, guildId, fine);
    }
    await EconomyRepo.update(robberId, guildId, { lastRob: new Date() });
    return { success: true, won, amount: won ? amount : Math.floor(amount * 0.5) };
  }

  async deposit(userId, guildId, amount) {
    const eco = await EconomyRepo.get(userId, guildId);
    if (eco.wallet < amount) return { success: false, error: 'notEnough' };
    await EconomyRepo.update(userId, guildId, { wallet: eco.wallet - amount, bank: eco.bank + amount });
    return { success: true };
  }

  async withdraw(userId, guildId, amount) {
    const eco = await EconomyRepo.get(userId, guildId);
    if (eco.bank < amount) return { success: false, error: 'notEnough' };
    await EconomyRepo.update(userId, guildId, { wallet: eco.wallet + amount, bank: eco.bank - amount });
    return { success: true };
  }

  async getLeaderboard(guildId, limit = 10) {
    return EconomyRepo.getLeaderboard(guildId, limit);
  }

  async _claimReward(userId, guildId, field, amount, cooldownMs) {
    const eco = await EconomyRepo.get(userId, guildId);
    if (eco[field] && Date.now() - eco[field].getTime() < cooldownMs) {
      return { success: false, cooldown: eco[field].getTime() + cooldownMs - Date.now() };
    }
    const streak = field === 'lastDaily' ? (eco.streak || 0) + 1 : undefined;
    const bonus = streak ? Math.floor(amount * (1 + streak * 0.05)) : amount;
    await EconomyRepo.addBalance(userId, guildId, bonus);
    const updateData = { [field]: new Date() };
    if (streak !== undefined) updateData.streak = streak;
    await EconomyRepo.update(userId, guildId, updateData);
    return { success: true, amount: bonus, streak };
  }
}

module.exports = EconomyService;
