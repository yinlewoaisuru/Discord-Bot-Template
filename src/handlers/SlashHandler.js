const fs = require('node:fs');
const path = require('node:path');
const {
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionsBitField,
  Collection,
} = require('discord.js');
const logger = require('../utils/logger');
const { createErrorEmbed } = require('../utils/embedBuilder');
const { printBadge } = require('../console/uiLogger');

function splitArgs(input = '') {
  const text = String(input || '').trim();
  if (!text) return [];
  const out = [];
  const regex = /"([^"]+)"|'([^']+)'|(\S+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    out.push(match[1] || match[2] || match[3]);
  }
  return out;
}

function normalizeReplyPayload(payload, fallbackContent = '') {
  if (typeof payload === 'string') return { content: payload };
  if (payload && typeof payload === 'object') return payload;
  return { content: fallbackContent };
}

class SlashHandler {
  constructor(client) {
    this.client = client;
  }

  async load() {
    let count = 0;
    count += this.loadFileBasedSlash();
    count += this.loadGeneratedSlashFromPrefix();
    printBadge('SLASH', `${count} slash commands loaded`, 'cyan', 'green');
    return count;
  }

  loadFileBasedSlash() {
    const slashPath = path.join(__dirname, '..', 'slashCommands');
    if (!fs.existsSync(slashPath)) return 0;

    let count = 0;
    const categories = fs.readdirSync(slashPath).filter((entry) =>
      fs.statSync(path.join(slashPath, entry)).isDirectory(),
    );

    for (const category of categories) {
      const categoryPath = path.join(slashPath, category);
      const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith('.js'));

      for (const file of files) {
        try {
          const command = require(path.join(categoryPath, file));
          if (!command.data?.name) continue;
          command.category = command.category || category;
          this.client.slash.set(command.data.name, command);
          count++;
        } catch (err) {
          logger.error(`[SlashHandler] Failed to load ${file}:`, err.message);
        }
      }
    }

    return count;
  }

  loadGeneratedSlashFromPrefix() {
    let count = 0;
    if (this.client.config.slash.generateFromPrefix === false) return count;

    const maxGenerated = Number(this.client.config.slash.maxGeneratedFromPrefix || 90);
    const excludedCategories = new Set(this.client.config.slash.excludedGeneratedCategories || []);

    for (const prefixCommand of this.client.commands.values()) {
      if (count >= maxGenerated) break;

      const name = String(prefixCommand.name || '').toLowerCase();
      if (!name || this.client.slash.has(name)) continue;
      if (!/^[\w-]{1,32}$/.test(name)) continue;
      if (excludedCategories.has(prefixCommand.category)) continue;

      const data = new SlashCommandBuilder()
        .setName(name)
        .setDescription((prefixCommand.description || `Execute ${name}`).slice(0, 100))
        .addStringOption((option) =>
          option
            .setName('input')
            .setDescription('Command arguments')
            .setRequired(false),
        );

      const guildOnly = prefixCommand.guildOnly ?? this.client.config.commands.guildOnly;
      if (guildOnly) data.setDMPermission(false);

      if (prefixCommand.userPermissions?.length) {
        try {
          const resolved = PermissionsBitField.resolve(prefixCommand.userPermissions);
          if (resolved) data.setDefaultMemberPermissions(resolved);
        } catch (_) {}
      }

      const command = {
        category: prefixCommand.category || 'General',
        data,
        run: async (client, interaction) => {
          const raw = interaction.options.getString('input', false) || '';
          const args = splitArgs(raw);
          const virtualContent = `${client.config.prefix}${name}${raw ? ` ${raw}` : ''}`;

          const mockMessage = {
            author: interaction.user,
            member: interaction.member,
            guild: interaction.guild,
            channel: interaction.channel,
            content: virtualContent,
            createdTimestamp: Date.now(),
            client,
            mentions: {
              users: new Collection(),
              members: new Collection(),
              roles: new Collection(),
              channels: new Collection(),
            },
            reply: async (payload) => {
              const safePayload = normalizeReplyPayload(payload, 'Done.');
              if (interaction.replied || interaction.deferred) {
                return interaction.followUp(safePayload);
              }
              return interaction.reply(safePayload);
            },
            delete: async () => {},
          };

          const originalSend = mockMessage.channel?.send?.bind(mockMessage.channel);
          if (originalSend) {
            mockMessage.channel.send = async (payload) => {
              const safePayload = normalizeReplyPayload(payload, 'Done.');
              if (interaction.replied || interaction.deferred) {
                return interaction.followUp(safePayload);
              }
              return interaction.reply(safePayload);
            };
          }

          try {
            await prefixCommand.run(client, mockMessage, args);
          } catch (err) {
            logger.error(`[SlashBridge] ${name}:`, err.message);
            const embed = createErrorEmbed('An error occurred while executing this command.');
            if (interaction.replied || interaction.deferred) {
              await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => {});
            } else {
              await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
            }
          } finally {
            if (originalSend && mockMessage.channel) {
              mockMessage.channel.send = originalSend;
            }
          }
        },
      };

      this.client.slash.set(name, command);
      count++;
    }

    return count;
  }

  async register() {
    let commands = this.client.slash.map((cmd) => (cmd.data.toJSON ? cmd.data.toJSON() : cmd.data));
    if (commands.length === 0) return;

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const clientId = process.env.CLIENT_ID || this.client.user?.id;
    const maxRegistered = Number(this.client.config.slash.maxRegistered || 100);

    if (commands.length > maxRegistered) {
      logger.warn(
        `[SlashHandler] Loaded ${commands.length} commands, trimming to ${maxRegistered} for registration.`,
      );
      commands = commands.slice(0, maxRegistered);
    }

    try {
      const guildId = this.client.config.slash.guildId;
      if (guildId) {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        printBadge('SLASH', `Registered ${commands.length} guild commands`, 'green', 'green');
      } else {
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        printBadge('SLASH', `Registered ${commands.length} global commands`, 'green', 'green');
      }
    } catch (err) {
      logger.error('[SlashHandler] Registration failed:', err.message);
    }
  }
}

module.exports = SlashHandler;
