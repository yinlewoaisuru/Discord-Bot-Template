const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');
const { formatDate, formatRelativeTime } = require('../../utils/formatters');

module.exports = {
  name: 'whois',
  aliases: ['lookup'],
  description: 'Detailed member lookup.',
  category: 'Utility',
  usage: '<user>',
  args: true,
  cooldown: 5,
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply({ embeds: [createErrorEmbed('User not found.')] });
    const user = member.user;
    const flags = (await user.fetchFlags()).toArray();
    const embed = createEmbed({
      type: 'info',
      title: `🔎 ${user.tag}`,
      thumbnail: user.displayAvatarURL({ size: 256, dynamic: true }),
      fields: [
        { name: 'ID', value: user.id, inline: true },
        { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: 'Nickname', value: member.nickname || 'None', inline: true },
        { name: 'Account Created', value: `${formatDate(user.createdAt)}\n(${formatRelativeTime(user.createdAt)})`, inline: true },
        { name: 'Joined Server', value: `${formatDate(member.joinedAt)}\n(${formatRelativeTime(member.joinedAt)})`, inline: true },
        { name: 'Boosting', value: member.premiumSince ? formatDate(member.premiumSince) : 'No', inline: true },
        { name: 'Badges', value: flags.length > 0 ? flags.join(', ') : 'None', inline: false },
        { name: `Roles [${member.roles.cache.size - 1}]`, value: member.roles.cache.filter(r => r.id !== message.guild.id).map(r => `${r}`).slice(0, 15).join(' ') || 'None', inline: false },
        { name: 'Permissions', value: member.permissions.toArray().slice(0, 10).join(', ') || 'None', inline: false },
      ],
    });
    await message.reply({ embeds: [embed] });
  },
};
