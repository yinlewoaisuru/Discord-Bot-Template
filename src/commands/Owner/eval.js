const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embedBuilder');
const { inspect } = require('node:util');

module.exports = { name: 'eval', aliases: [], description: 'Evaluate JavaScript code.', category: 'Owner', ownerOnly: true, usage: '<code>', args: true, cooldown: 0,
  async run(client, message, args) {
    const code = args.join(' ');
    try {
      let result = eval(code);
      if (result instanceof Promise) result = await result;
      let output = typeof result === 'string' ? result : inspect(result, { depth: 2 });
      if (output.length > 1900) output = output.slice(0, 1900) + '...';
      await message.reply({ embeds: [createSuccessEmbed(`\`\`\`js\n${output}\n\`\`\``)] });
    } catch (err) {
      await message.reply({ embeds: [createErrorEmbed(`\`\`\`js\n${err.message}\n\`\`\``)] });
    }
  },
};
