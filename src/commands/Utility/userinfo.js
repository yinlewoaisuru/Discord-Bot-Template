const { createEmbed } = require('../../utils/embedBuilder');
const { formatDate, formatRelativeTime } = require('../../utils/formatters');
const { resolveMember } = require('../../utils/resolvers');

module.exports = {
  name: 'userinfo',
  aliases: ['ui', 'whois', 'user'],
  description: 'Display information about a user.',
  category: 'Utility',
  cooldown: 5,
  async run(client, message, args) {
    const member = args[0] ? resolveMember(message, args[0]) || message.member : message.member;
    const user = member.user;
    const roles = member.roles.cache.filter(r => r.id !== message.guild.id).sort((a, b) => b.position - a.position);

    const embed = createEmbed({
      type: 'info',
      title: `👤 ${user.tag}`,
      thumbnail: user.displayAvatarURL({ size: 256, dynamic: true }),
      fields: [
        { name: 'ID', value: user.id, inline: true },
        { name: 'Nickname', value: member.nickname || 'None', inline: true },
        { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: 'Created', value: `${formatDate(user.createdAt)}\n${formatRelativeTime(user.createdAt)}`, inline: true },
        { name: 'Joined', value: `${formatDate(member.joinedAt)}\n${formatRelativeTime(member.joinedAt)}`, inline: true },
        { name: 'Boost Since', value: member.premiumSince ? formatDate(member.premiumSince) : 'Not boosting', inline: true },
        { name: `Roles [${roles.size}]`, value: roles.size > 0 ? roles.map(r => `${r}`).slice(0, 20).join(', ') : 'None', inline: false },
        { name: 'Highest Role', value: `${member.roles.highest}`, inline: true },
        { name: 'Color', value: member.displayHexColor, inline: true },
      ],
    });
    await message.reply({ embeds: [embed] });
  },
};
