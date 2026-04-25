const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'automod', aliases: ['am'], description: 'Configure automod settings.', category: 'Automod', usage: '<antispam|antilink|capsfilter|massmention|badwords|antiphish> <on|off>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const automodService = client.container.get('automod');
    const module_ = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const modules = ['antispam', 'antilink', 'capsfilter', 'massmention', 'badwords', 'antiphish'];
    if (!module_ || !modules.includes(module_)) {
      const config = await automodService.getConfig(message.guild.id);
      const desc = modules.map(m => {
        const key = m === 'capsfilter' ? 'capsFilter' : m === 'massmention' ? 'massMention' : m === 'badwords' ? 'badWords' : m;
        const enabled = config[key]?.enabled ? '✅' : '❌';
        return `${enabled} **${m}**`;
      }).join('\n');
      return message.reply({ embeds: [createEmbed({ type: 'info', title: '🛡️ Automod Settings', description: desc + `\n\nUsage: \`${client.config.prefix}automod <module> <on|off>\`` })] });
    }
    if (!['on', 'off'].includes(action)) return message.reply({ embeds: [createErrorEmbed('Use `on` or `off`.')] });
    const key = module_ === 'capsfilter' ? 'capsFilter' : module_ === 'massmention' ? 'massMention' : module_ === 'badwords' ? 'badWords' : module_;
    await automodService.updateConfig(message.guild.id, { [`${key}.enabled`]: action === 'on' });
    await message.reply({ embeds: [createSuccessEmbed(`🛡️ **${module_}** has been **${action === 'on' ? 'enabled' : 'disabled'}**.`)] });
  },
};
