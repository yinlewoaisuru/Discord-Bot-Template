class BaseCommand {
  constructor(options = {}) {
    this.name = options.name || '';
    this.aliases = options.aliases || [];
    this.description = options.description || '';
    this.category = options.category || 'Utility';
    this.usage = options.usage || '';
    this.examples = options.examples || [];
    this.cooldown = options.cooldown ?? 3;
    this.userPermissions = options.userPermissions || [];
    this.botPermissions = options.botPermissions || [];
    this.ownerOnly = options.ownerOnly || false;
    this.guildOnly = options.guildOnly ?? true;
    this.nsfw = options.nsfw || false;
    this.enabled = options.enabled ?? true;
    this.args = options.args || false;
    this.minArgs = options.minArgs || 0;
    this.maxArgs = options.maxArgs || Infinity;
  }

  async run(client, message, args) {
    throw new Error(`Command ${this.name} does not implement run()`);
  }
}

module.exports = BaseCommand;
