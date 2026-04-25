const { createEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'rps', aliases: ['rockpaperscissors'], description: 'Play rock paper scissors.', category: 'Fun', usage: '<rock|paper|scissors>', args: true, cooldown: 3,
  async run(client, message, args) {
    const choices = ['rock', 'paper', 'scissors'];
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    const input = args[0].toLowerCase();
    if (!choices.includes(input)) return message.reply('Choose `rock`, `paper`, or `scissors`.');
    const bot = choices[Math.floor(Math.random() * 3)];
    let result;
    if (input === bot) result = "It's a tie! 🤝";
    else if ((input === 'rock' && bot === 'scissors') || (input === 'paper' && bot === 'rock') || (input === 'scissors' && bot === 'paper')) result = 'You win! 🎉';
    else result = 'You lose! 😔';
    await message.reply({ embeds: [createEmbed({ type: 'fun', title: '✊✋✌️ Rock Paper Scissors', description: `You: ${emojis[input]} **${input}**\nBot: ${emojis[bot]} **${bot}**\n\n${result}` })] });
  },
};
