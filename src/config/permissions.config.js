const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  Moderation: {
    user: [PermissionFlagsBits.ModerateMembers],
    bot: [PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.BanMembers, PermissionFlagsBits.KickMembers],
  },
  Automod: {
    user: [PermissionFlagsBits.ManageGuild],
    bot: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageGuild],
  },
  Utility: {
    user: [],
    bot: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
  },
  Fun: {
    user: [],
    bot: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
  },
  Economy: {
    user: [],
    bot: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
  },
  Leveling: {
    user: [],
    bot: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles],
  },
  Ticket: {
    user: [],
    bot: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.SendMessages],
  },
  Giveaway: {
    user: [PermissionFlagsBits.ManageGuild],
    bot: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions],
  },
  Config: {
    user: [PermissionFlagsBits.ManageGuild],
    bot: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
  },
  Owner: {
    user: [],
    bot: [PermissionFlagsBits.SendMessages],
  },
};
