const { PermissionFlagsBits } = require('discord.js');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const GuildRepo = require('../../database/repositories/GuildRepo');

module.exports = { name: 'setlang', aliases: ['setlanguage'], description: 'Set the server language.', category: 'Config', usage: '<vi|en|ja|zh>', args: true, cooldown: 5, userPermissions: [PermissionFlagsBits.ManageGuild],
  async run(client, message, args) {
    const lang = args[0].toLowerCase();
    const supported = ['vi', 'en', 'ja', 'zh'];
    if (!supported.includes(lang)) return message.reply({ embeds: [createErrorEmbed(`Supported: ${supported.join(', ')}`)] });
    await GuildRepo.update(message.guild.id, { language: lang });
    await message.reply({ embeds: [createSuccessEmbed(`Server language set to **${lang}**.`)] });
  },
};
