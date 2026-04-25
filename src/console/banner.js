const { c } = require('./uiLogger');

function printStartupBanner() {
  const lines = [
    '',
    c.bPurple('  ███╗   ██╗ ██████╗ ██╗   ██╗███████╗██╗      █████╗ '),
    c.bPurple('  ████╗  ██║██╔═══██╗██║   ██║██╔════╝██║     ██╔══██╗'),
    c.purple ('  ██╔██╗ ██║██║   ██║██║   ██║█████╗  ██║     ███████║'),
    c.purple ('  ██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══╝  ██║     ██╔══██║'),
    c.dim    ('  ██║ ╚████║╚██████╔╝ ╚████╔╝ ███████╗███████╗██║  ██║'),
    c.dim    ('  ╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═╝'),
    '',
    c.gray   ('  ─────────────────────────────────────────────────────'),
    `  ${c.dim('Advanced Discord Framework')}  ${c.bPurple('v3.0')}  ${c.dim('by')} ${c.cyan('novela.bot')}`,
    c.gray   ('  ─────────────────────────────────────────────────────'),
    '',
  ];
  lines.forEach(l => console.log(l));
}

module.exports = { printStartupBanner };
