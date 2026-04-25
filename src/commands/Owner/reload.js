const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');

module.exports = { name: 'reload', aliases: [], description: 'Reload a command.', category: 'Owner', ownerOnly: true, usage: '<command>', args: true, cooldown: 0,
  async run(client, message, args) {
    const cmd = args[0].toLowerCase();
    const reloaded = client.commandHandler.reload(cmd);
    if (!reloaded) return message.reply({ embeds: [createErrorEmbed(`Command \`${cmd}\` not found.`)] });
    await message.reply({ embeds: [createSuccessEmbed(`🔄 Reloaded command \`${cmd}\`.`)] });
  },
};
