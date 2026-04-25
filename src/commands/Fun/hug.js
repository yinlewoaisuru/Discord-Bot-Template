const { createEmbed } = require('../../utils/embedBuilder');
const { resolveMember } = require('../../utils/resolvers');

const actions = {
  hug: { emoji: '🤗', text: '**{user}** hugs **{target}**!' },
  pat: { emoji: '🫳', text: '**{user}** pats **{target}**!' },
  slap: { emoji: '👋', text: '**{user}** slaps **{target}**!' },
  kiss: { emoji: '💋', text: '**{user}** kisses **{target}**!' },
  poke: { emoji: '👉', text: '**{user}** pokes **{target}**!' },
  bite: { emoji: '😬', text: '**{user}** bites **{target}**!' },
  cuddle: { emoji: '🥰', text: '**{user}** cuddles **{target}**!' },
  wave: { emoji: '👋', text: '**{user}** waves at **{target}**!' },
  wink: { emoji: '😉', text: '**{user}** winks at **{target}**!' },
  bonk: { emoji: '🔨', text: '**{user}** bonks **{target}**!' },
};

for (const [name, data] of Object.entries(actions)) {
  module.exports = { name, aliases: [], description: `${name.charAt(0).toUpperCase() + name.slice(1)} someone.`, category: 'Fun', usage: '<user>', args: true, cooldown: 3,
    async run(client, message, args) {
      const member = resolveMember(message, args[0]);
      if (!member) return message.reply('User not found.');
      const text = data.text.replace('{user}', message.author.username).replace('{target}', member.user.username);
      await message.reply({ embeds: [createEmbed({ type: 'fun', title: `${data.emoji} ${name.charAt(0).toUpperCase() + name.slice(1)}`, description: text })] });
    },
  };
  break;
}
