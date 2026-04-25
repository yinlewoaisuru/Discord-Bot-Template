const { createEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = {
  name: 'avatar',
  aliases: ['av', 'pfp'],
  description: 'Display a user\'s avatar.',
  category: 'Utility',
  usage: '[user]',
  cooldown: 3,
  async run(client, message, args) {
    const member = args[0] ? resolveMember(message, args[0]) || message.member : message.member;
    const user = member.user;
    const embed = createEmbed({
      type: 'info',
      title: `🖼️ ${user.tag}'s Avatar`,
      image: user.displayAvatarURL({ size: 1024, dynamic: true }),
      description: `[PNG](${user.displayAvatarURL({ size: 1024, format: 'png' })}) | [JPG](${user.displayAvatarURL({ size: 1024, format: 'jpg' })}) | [WEBP](${user.displayAvatarURL({ size: 1024, format: 'webp' })})`,
    });
    await message.reply({ embeds: [embed] });
  },
};
