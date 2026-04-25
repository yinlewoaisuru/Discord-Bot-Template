const { createEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { resolveMember, fetchUser } = require('../../utils/resolvers');

module.exports = {
  name: 'banner',
  aliases: [],
  description: 'Display a user\'s banner.',
  category: 'Utility',
  usage: '[user]',
  cooldown: 5,
  async run(client, message, args) {
    const member = args[0] ? resolveMember(message, args[0]) || message.member : message.member;
    const user = await client.users.fetch(member.user.id, { force: true });
    const bannerUrl = user.bannerURL({ size: 1024, dynamic: true });
    if (!bannerUrl) return message.reply({ embeds: [createErrorEmbed('This user has no banner.')] });
    const embed = createEmbed({ type: 'info', title: `🖼️ ${user.tag}'s Banner`, image: bannerUrl });
    await message.reply({ embeds: [embed] });
  },
};
