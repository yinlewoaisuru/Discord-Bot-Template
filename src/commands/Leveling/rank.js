const { createEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');
const { formatNumber } = require('../../utils/formatters');

module.exports = { name: 'rank', aliases: ['xp', 'level'], description: 'View your rank card.', category: 'Leveling', usage: '[user]', cooldown: 5,
  async run(client, message, args) {
    const member = args[0] ? resolveMember(message, args[0]) || message.member : message.member;
    const levelingService = client.container.get('leveling');
    if (!levelingService) return;
    const data = await levelingService.getRank(member.id, message.guild.id);
    const embed = createEmbed({
      type: 'leveling',
      title: `📊 ${member.user.username}'s Rank`,
      thumbnail: member.user.displayAvatarURL({ size: 128 }),
      fields: [
        { name: '🏅 Rank', value: `#${data.rank}`, inline: true },
        { name: '📊 Level', value: `${data.level}`, inline: true },
        { name: '✨ XP', value: `${formatNumber(data.xp)} / ${formatNumber(data.requiredXp)}`, inline: true },
        { name: '💬 Messages', value: formatNumber(data.messages), inline: true },
        { name: '📈 Total XP', value: formatNumber(data.totalXp), inline: true },
      ],
    });
    await message.reply({ embeds: [embed] });
  },
};
