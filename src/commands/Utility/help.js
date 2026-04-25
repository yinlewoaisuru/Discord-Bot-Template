const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embedBuilder');
const { CATEGORIES, CATEGORY_EMOJIS } = require('../../config/constants.config');
const { paginate } = require('../../utils/paginator');
const { chunk } = require('../../utils/formatters');

module.exports = {
  name: 'help',
  aliases: ['h', 'commands'],
  description: 'Show all commands or info about a specific command.',
  category: 'Utility',
  usage: '[command]',
  cooldown: 3,
  async run(client, message, args) {
    if (args[0]) {
      const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
      if (!cmd) return message.reply({ embeds: [createEmbed({ type: 'error', title: '❌ Not Found', description: `Command \`${args[0]}\` not found.` })] });

      const embed = createEmbed({
        type: 'info',
        title: `📖 Command: ${cmd.name}`,
        fields: [
          { name: 'Description', value: cmd.description || 'N/A', inline: false },
          { name: 'Category', value: cmd.category || 'N/A', inline: true },
          { name: 'Cooldown', value: `${cmd.cooldown || 3}s`, inline: true },
          { name: 'Aliases', value: cmd.aliases?.length ? cmd.aliases.map(a => `\`${a}\``).join(', ') : 'None', inline: true },
          { name: 'Usage', value: cmd.usage ? `\`${client.config.prefix}${cmd.name} ${cmd.usage}\`` : `\`${client.config.prefix}${cmd.name}\``, inline: false },
        ],
      });
      return message.reply({ embeds: [embed] });
    }

    const categories = {};
    client.commands.forEach(cmd => {
      const cat = cmd.category || 'Utility';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    });

    const pages = Object.entries(categories).map(([cat, cmds]) => {
      const emoji = CATEGORY_EMOJIS[cat] || '📦';
      return createEmbed({
        type: 'default',
        title: `${emoji} ${cat} Commands`,
        description: cmds.map(c => `\`${c.name}\` — ${c.description || 'No description'}`).join('\n'),
        footerOverride: { text: `${cmds.length} commands • Use ${client.config.prefix}help <command> for details` },
      });
    });

    const overview = createEmbed({
      type: 'default',
      title: '🌙 Novela — Help Menu',
      description: `Use the buttons to navigate categories.\nPrefix: \`${client.config.prefix}\`\n\n` +
        Object.entries(categories).map(([cat, cmds]) => `${CATEGORY_EMOJIS[cat] || '📦'} **${cat}** — ${cmds.length} commands`).join('\n'),
    });

    await paginate(message, [overview, ...pages]);
  },
};
