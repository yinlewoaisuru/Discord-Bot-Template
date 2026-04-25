const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = {
  name: 'unban',
  aliases: [],
  description: 'Unban a user from the server.',
  category: 'Moderation',
  usage: '<userId> [reason]',
  args: true,
  cooldown: 5,
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  async run(client, message, args) {
    const userId = args[0];
    if (!/^\d{17,19}$/.test(userId)) return message.reply({ embeds: [createErrorEmbed('Please provide a valid user ID.')] });
    const reason = args.slice(1).join(' ') || 'No reason provided';
    const modService = client.container.get('moderation');
    const result = await modService.unban(message.guild, userId, message.member, reason);
    if (!result.success) return message.reply({ embeds: [createErrorEmbed(result.error)] });
    await message.reply({ embeds: [createSuccessEmbed(`🔓 User \`${userId}\` has been unbanned.`)] });
  },
};
