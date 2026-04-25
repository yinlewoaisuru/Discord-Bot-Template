const { createEmbed } = require('../../utils/embedBuilder');

const answers = ['It is certain.', 'Without a doubt.', 'Yes, definitely.', 'You may rely on it.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];

module.exports = { name: '8ball', aliases: ['eightball', 'ask'], description: 'Ask the magic 8-ball.', category: 'Fun', usage: '<question>', args: true, cooldown: 3,
  async run(client, message, args) {
    const answer = answers[Math.floor(Math.random() * answers.length)];
    await message.reply({ embeds: [createEmbed({ type: 'fun', title: '🎱 Magic 8-Ball', fields: [{ name: 'Question', value: args.join(' '), inline: false }, { name: 'Answer', value: answer, inline: false }] })] });
  },
};
