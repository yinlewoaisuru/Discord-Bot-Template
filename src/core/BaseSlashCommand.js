class BaseSlashCommand {
  constructor(options = {}) {
    this.name = options.name || '';
    this.description = options.description || '';
    this.category = options.category || 'Utility';
    this.cooldown = options.cooldown ?? 3;
    this.userPermissions = options.userPermissions || [];
    this.botPermissions = options.botPermissions || [];
    this.ownerOnly = options.ownerOnly || false;
    this.enabled = options.enabled ?? true;
    this.ephemeral = options.ephemeral || false;
    this.options = options.options || [];
  }

  buildData() {
    return {
      name: this.name,
      description: this.description,
      options: this.options,
      default_member_permissions: this.userPermissions.length
        ? this.userPermissions.reduce((a, b) => a | b, 0n).toString()
        : undefined,
    };
  }

  async run(client, interaction) {
    throw new Error(`SlashCommand ${this.name} does not implement run()`);
  }

  async autocomplete(client, interaction) {}
}

module.exports = BaseSlashCommand;
