class BaseEvent {
  constructor(options = {}) {
    this.name = options.name || '';
    this.once = options.once || false;
    this.enabled = options.enabled ?? true;
  }

  async execute(...args) {
    throw new Error(`Event ${this.name} does not implement execute()`);
  }
}

module.exports = BaseEvent;
