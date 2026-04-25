const { createEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'slap', aliases: [], description: 'Slap someone.', category: 'Fun', usage: '<user>', args: true, cooldown: 3,
  async run(client, message, args) {
    const member = resolveMember(message, args[0]);
    if (!member) return message.reply('User not found.');
    await message.reply({ embeds: [createEmbed({ type: 'fun', title: '👋 Slap', description: `**${message.author.username}** slaps **${member.user.username}**!` })] });
  },
};
