const fs = require('node:fs');
const path = require('node:path');
const { styleText } = require('node:util');

const LOG_DIR = path.join(process.cwd(), 'logs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const LEVEL_COLORS = {
  error: ['bold', 'red'],
  warn:  ['bold', 'yellow'],
  info:  ['bold', 'cyan'],
  debug: ['dim'],
};

const currentLevel = LEVELS[process.env.LOG_LEVEL || 'info'] ?? LEVELS.info;

function formatTimestamp() {
  return new Date().toISOString();
}

function writeToFile(filename, message) {
  try {
    const filePath = path.join(LOG_DIR, filename);
    fs.appendFileSync(filePath, message + '\n');
  } catch (_) {}
}

function log(level, ...args) {
  if (LEVELS[level] === undefined || LEVELS[level] > currentLevel) return;

  const ts = formatTimestamp();
  const tag = level.toUpperCase().padEnd(5);
  const message = args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ');

  const plainLine = `[${ts}] [${tag}] ${message}`;
  writeToFile('combined.log', plainLine);

  if (level === 'error') {
    writeToFile('error.log', plainLine);
  }
  if (level === 'debug') {
    writeToFile('debug.log', plainLine);
  }

  const coloredTag = styleText(LEVEL_COLORS[level] || ['white'], tag);
  const dimTs = styleText(['dim'], ts.slice(11, 19));
  console.log(`  ${dimTs} ${coloredTag} ${message}`);
}

module.exports = {
  error: (...args) => log('error', ...args),
  warn:  (...args) => log('warn', ...args),
  info:  (...args) => log('info', ...args),
  debug: (...args) => log('debug', ...args),
  log,
};
