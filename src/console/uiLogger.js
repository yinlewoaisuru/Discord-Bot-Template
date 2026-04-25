const { styleText } = require('node:util');

const c = {
  purple:  (t) => styleText(['magenta'],        t),
  cyan:    (t) => styleText(['cyan'],           t),
  green:   (t) => styleText(['green'],          t),
  yellow:  (t) => styleText(['yellow'],         t),
  red:     (t) => styleText(['red'],            t),
  blue:    (t) => styleText(['blue'],           t),
  white:   (t) => styleText(['white'],          t),
  gray:    (t) => styleText(['dim'],            t),
  bold:    (t) => styleText(['bold'],           t),
  dim:     (t) => styleText(['dim'],            t),
  italic:  (t) => styleText(['italic'],         t),
  bPurple: (t) => styleText(['bold', 'magenta'], t),
  bCyan:   (t) => styleText(['bold', 'cyan'],    t),
  bGreen:  (t) => styleText(['bold', 'green'],   t),
  bYellow: (t) => styleText(['bold', 'yellow'],  t),
  bRed:    (t) => styleText(['bold', 'red'],     t),
  bBlue:   (t) => styleText(['bold', 'blue'],    t),
  bWhite:  (t) => styleText(['bold', 'white'],   t),
};

function stripAnsi(str) {
  return String(str).replace(/\x1b\[[0-9;]*m/g, '');
}

const BOX = {
  tl: '╭', tr: '╮', bl: '╰', br: '╯',
  h: '─', v: '│', cross: '┼',
  lt: '├', rt: '┤',
};

function printBanner() {
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

function printBox(lines, accentColor = 'purple', label = '') {
  const colorFn = c[accentColor] ?? c.purple;
  const maxLen  = Math.max(...lines.map(l => stripAnsi(l).length), label.length + 4) + 2;

  const topLabel = label ? ` ${c.bWhite(label)} ` : '';
  const topLabelLen = stripAnsi(topLabel).length;
  const topLine = label
    ? colorFn(BOX.tl) + colorFn(BOX.h.repeat(2)) + topLabel + colorFn(BOX.h.repeat(maxLen - topLabelLen)) + colorFn(BOX.tr)
    : colorFn(BOX.tl + BOX.h.repeat(maxLen + 2) + BOX.tr);

  console.log(topLine);
  for (const line of lines) {
    const visual = stripAnsi(line).length;
    const pad    = ' '.repeat(Math.max(0, maxLen - visual));
    console.log(colorFn(BOX.v) + ' ' + line + pad + ' ' + colorFn(BOX.v));
  }
  console.log(colorFn(BOX.bl + BOX.h.repeat(maxLen + 2) + BOX.br));
}

function printTable(headers, rows, accentColor = 'cyan') {
  const colorFn = c[accentColor] ?? c.cyan;
  const allRows = [headers, ...rows];
  const colWidths = headers.map((_, ci) =>
    Math.max(...allRows.map(r => stripAnsi(String(r[ci] ?? '')).length))
  );

  const sep = colorFn(BOX.lt + colWidths.map(w => BOX.h.repeat(w + 2)).join(BOX.h) + BOX.rt);
  const fmt = (row, isHeader) =>
    colorFn(BOX.v) +
    row.map((cell, ci) => {
      const str = String(cell ?? '');
      const pad = ' '.repeat(colWidths[ci] - stripAnsi(str).length);
      return ' ' + (isHeader ? c.bWhite(str) : str) + pad + ' ';
    }).join(colorFn(BOX.v)) +
    colorFn(BOX.v);

  const top = colorFn(BOX.tl + colWidths.map(w => BOX.h.repeat(w + 2)).join(BOX.h) + BOX.tr);
  const bot = colorFn(BOX.bl + colWidths.map(w => BOX.h.repeat(w + 2)).join(BOX.h) + BOX.br);

  console.log(top);
  console.log(fmt(headers, true));
  console.log(sep);
  rows.forEach(r => console.log(fmt(r, false)));
  console.log(bot);
}

function printBadge(label, value, labelColor = 'purple', valueColor = 'white') {
  const tag = (c[`b${labelColor.charAt(0).toUpperCase() + labelColor.slice(1)}`] ?? c.bPurple)(`[${label}]`);
  const val = (c[valueColor] ?? c.white)(value);
  console.log(`  ${tag} ${val}`);
}

function printSep(color = 'gray', char = '─', length = 56) {
  console.log((c[color] ?? c.gray)('  ' + char.repeat(length)));
}

function printLog(level, message, color = 'cyan') {
  const ts   = c.dim(new Date().toISOString().slice(11, 19));
  const tag  = (c[`b${color.charAt(0).toUpperCase() + color.slice(1)}`] ?? c.bCyan)(level.toUpperCase().padEnd(5));
  console.log(`  ${ts} ${tag} ${message}`);
}

module.exports = {
  c,
  printBanner,
  printBox,
  printTable,
  printBadge,
  printSep,
  printLog,
  stripAnsi,
};
