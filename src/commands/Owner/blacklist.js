const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'blacklist', aliases: ['bl'], description: 'Blacklist a user or guild.', category: 'Owner', ownerOnly: true, usage: '<add|remove|list> [userId]', args: true, cooldown: 0,
  async run(client, message, args) {
    const blService = client.container.get('blacklist');
    const action = args[0].toLowerCase();
    if (action === 'list') {
      const list = await blService.getAll();
      if (!list.length) return message.reply({ embeds: [createSuccessEmbed('No blacklisted entries.')] });
      const desc = list.map(e => `\`${e.targetId}\` (${e.type}) — ${e.reason}`).join('\n');
      return message.reply({ embeds: [createSuccessEmbed(`📋 Blacklist:\n${desc.slice(0, 4000)}`)] });
    }
    if (!args[1]) return message.reply({ embeds: [createErrorEmbed('Provide a user/guild ID.')] });
    if (action === 'add') {
      const reason = args.slice(2).join(' ') || 'No reason';
      await blService.add(args[1], 'user', reason, message.author.id);
      return message.reply({ embeds: [createSuccessEmbed(`Added \`${args[1]}\` to blacklist.`)] });
    }
    if (action === 'remove') {
      await blService.remove(args[1]);
      return message.reply({ embeds: [createSuccessEmbed(`Removed \`${args[1]}\` from blacklist.`)] });
    }
  },
};
