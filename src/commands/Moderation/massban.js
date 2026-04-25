const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'massban', aliases: ['mb'], description: 'Ban multiple users by ID.', category: 'Moderation', usage: '<id1> <id2> ...', args: true, cooldown: 10, userPermissions: [PermissionFlagsBits.BanMembers], botPermissions: [PermissionFlagsBits.BanMembers],
  async run(client, message, args) {
    const ids = args.filter(id => /^\d{17,19}$/.test(id));
    if (!ids.length) return message.reply({ embeds: [createErrorEmbed('Provide valid user IDs.')] });
    let banned = 0, failed = 0;
    for (const id of ids) {
      try { await message.guild.bans.create(id, { reason: `Massban by ${message.author.tag}` }); banned++; } catch (_) { failed++; }
    }
    await message.reply({ embeds: [createSuccessEmbed(`🔨 Massban complete.\n✅ Banned: **${banned}**\n❌ Failed: **${failed}**`)] });
  },
};
