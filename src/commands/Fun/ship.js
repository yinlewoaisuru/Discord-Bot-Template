const { createEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

module.exports = { name: 'ship', aliases: ['love', 'match'], description: 'Ship two users together.', category: 'Fun', usage: '<user1> [user2]', args: true, cooldown: 5,
  async run(client, message, args) {
    const user1 = resolveMember(message, args[0])?.user || message.author;
    const user2 = args[1] ? (resolveMember(message, args[1])?.user || message.author) : message.author;
    const seed = (BigInt(user1.id) + BigInt(user2.id)) % 101n;
    const percent = Number(seed);
    let bar = '';
    for (let i = 0; i < 10; i++) bar += i < Math.floor(percent / 10) ? '❤️' : '🖤';
    let verdict;
    if (percent >= 80) verdict = 'Perfect match! 💘';
    else if (percent >= 60) verdict = 'Great chemistry! 💕';
    else if (percent >= 40) verdict = 'There\'s something there! 💗';
    else if (percent >= 20) verdict = 'Maybe just friends... 💔';
    else verdict = 'Not meant to be. 😢';
    await message.reply({ embeds: [createEmbed({ type: 'fun', title: '💕 Love Calculator', description: `**${user1.username}** x **${user2.username}**\n\n${bar}\n**${percent}%** — ${verdict}` })] });
  },
};
