const { Events } = require('discord.js');
const GuildRepo = require('../../database/repositories/GuildRepo');
const { createErrorEmbed } = require('../../utils/embedBuilder');
const { formatDuration } = require('../../utils/formatters');
const logger = require('../../utils/logger');

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    try {
      const statsService = client.container.get('stats');
      if (statsService) statsService.trackMessage();

      const afkService = client.container.get('afk');
      if (afkService) {
        const afkData = await afkService.get(message.author.id);
        if (afkData) {
          await afkService.remove(message.author.id);
          const duration = formatDuration(Date.now() - afkData.timestamp.getTime());
          await message.reply({ content: `👋 Welcome back, **${message.author.username}**! You were AFK for ${duration}.` }).catch(() => {});
        }

        for (const mentioned of message.mentions.users.values()) {
          const mentionedAfk = await afkService.get(mentioned.id);
          if (mentionedAfk) {
            const duration = formatDuration(Date.now() - mentionedAfk.timestamp.getTime());
            await message.reply({ content: `💤 **${mentioned.username}** is AFK: ${mentionedAfk.reason} (${duration} ago)` }).catch(() => {});
          }
        }
      }

      const automodService = client.container.get('automod');
      if (automodService) {
        const actions = await automodService.processMessage(message);
        if (actions.length > 0) {
          await automodService.executeActions(message, actions);
          if (actions.some(a => a.action === 'delete')) return;
        }
      }

      const levelingService = client.container.get('leveling');
      if (levelingService) {
        const result = await levelingService.processMessage(message);
        if (result?.levelUp) {
          const { createLevelEmbed } = require('../../utils/embedBuilder');
          const embed = createLevelEmbed({ title: '🎉 Level Up!', description: `Congratulations **${message.author.username}**! You reached level **${result.level}**!` });
          await message.channel.send({ embeds: [embed] }).catch(() => {});
        }
      }

      const guildConfig = await GuildRepo.get(message.guild.id);
      const prefix = guildConfig.prefix || client.config.prefix;

      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/\s+/);
      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
      if (!command) return;

      if (command.args && args.length < (command.minArgs || 1)) {
        return message.reply({ embeds: [createErrorEmbed(`Usage: \`${prefix}${command.name} ${command.usage || ''}\``)] });
      }

      try {
        const context = {
          client,
          command,
          message,
          args,
          prefix,
          locale: guildConfig.language || client.config.i18n.defaultLocale,
          handled: false,
        };
        await client.pipeline.execute(context);
        if (context.handled) return;

        await command.run(client, message, args);
        if (statsService) await statsService.trackCommand(command.name);
      } catch (err) {
        logger.error(`[CMD] ${command.name}:`, err.message);
        await message.reply({ embeds: [createErrorEmbed('An error occurred.')] }).catch(() => {});
      }
    } catch (err) {
      logger.error('[MessageCreate]', err.message);
    }
  },
};
