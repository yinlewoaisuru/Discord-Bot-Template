const { createEmbed } = require('../../utils/embedBuilder');
const { formatDate, formatNumber } = require('../../utils/formatters');
const { ChannelType } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  aliases: ['si', 'server', 'guildinfo'],
  description: 'Display information about the server.',
  category: 'Utility',
  cooldown: 5,
  async run(client, message) {
    const guild = message.guild;
    const owner = await guild.fetchOwner().catch(() => null);
    const channels = guild.channels.cache;
    const text = channels.filter(c => c.type === ChannelType.GuildText).size;
    const voice = channels.filter(c => c.type === ChannelType.GuildVoice).size;
    const categories = channels.filter(c => c.type === ChannelType.GuildCategory).size;

    const embed = createEmbed({
      type: 'info',
      title: `🏰 ${guild.name}`,
      thumbnail: guild.iconURL({ size: 256, dynamic: true }),
      fields: [
        { name: 'ID', value: guild.id, inline: true },
        { name: 'Owner', value: owner ? owner.user.tag : 'Unknown', inline: true },
        { name: 'Created', value: formatDate(guild.createdAt), inline: true },
        { name: 'Members', value: formatNumber(guild.memberCount), inline: true },
        { name: 'Roles', value: formatNumber(guild.roles.cache.size), inline: true },
        { name: 'Emojis', value: formatNumber(guild.emojis.cache.size), inline: true },
        { name: 'Channels', value: `📝 ${text} | 🔊 ${voice} | 📁 ${categories}`, inline: false },
        { name: 'Boost Level', value: `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount} boosts)`, inline: true },
        { name: 'Verification', value: guild.verificationLevel.toString(), inline: true },
      ],
    });
    if (guild.bannerURL()) embed.setImage(guild.bannerURL({ size: 512 }));
    await message.reply({ embeds: [embed] });
  },
};
