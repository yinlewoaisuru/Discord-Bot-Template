const { c, printBox, printTable, printSep, printBadge } = require('./uiLogger');

function printStartupSummary(client) {
  const totalMembers = client.guilds.cache
    .reduce((a, g) => a + (g.memberCount || 0), 0)
    .toLocaleString('vi-VN');

  printBox([
    `  ${c.dim('Tag')}        ${c.bPurple(client.user.tag)}`,
    `  ${c.dim('ID')}         ${c.cyan(client.user.id)}`,
    `  ${c.dim('Guilds')}     ${c.bGreen(client.guilds.cache.size.toLocaleString())}`,
    `  ${c.dim('Members')}    ${c.bGreen(totalMembers)}`,
    `  ${c.dim('Prefix')}     ${c.yellow(client.config?.prefix ?? '.')}`,
    `  ${c.dim('Cluster')}    ${c.blue(String(client.cluster?.id ?? 'N/A'))}`,
    `  ${c.dim('Node.js')}    ${c.dim(process.version)}`,
    `  ${c.dim('Env')}        ${c.dim(process.env.NODE_ENV || 'development')}`,
  ], 'purple', 'NOVELA ONLINE');

  printTable(
    ['Type', 'Loaded', 'Status'],
    [
      [c.cyan('Prefix Commands'),    c.bGreen(String(client.commands?.size ?? 0)),   c.green('✓ Ready')],
      [c.cyan('Slash Commands'),     c.bGreen(String(client.slash?.size ?? 0)),      c.green('✓ Ready')],
      [c.cyan('Component Handlers'), c.bGreen(String(client.components?.size ?? 0)), c.green('✓ Ready')],
    ],
    'purple'
  );

  printSep('gray');
}

function printHandlerSummary(name, count, emoji = '📦') {
  printBadge(name.toUpperCase(), `${emoji} ${count} loaded`, 'cyan', 'green');
}

module.exports = { printStartupSummary, printHandlerSummary };
