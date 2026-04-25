const COLORS = {
  default:    '#5111f5',
  success:    '#4ADE80',
  error:      '#F87171',
  warning:    '#FBBF24',
  info:       '#60A5FA',
  loading:    '#A78BFA',
  moderation: '#F97316',
  economy:    '#F59E0B',
  leveling:   '#818CF8',
  music:      '#34D399',
  fun:        '#FB7185',
  ticket:     '#38BDF8',
  giveaway:   '#E879F9',
  automod:    '#FB923C',
  config:     '#94A3B8',
  logging:    '#6B7280',
  welcome:    '#86EFAC',
  boost:      '#F472B6',
  owner:      '#EF4444',
};

function resolveColor(keyOrHex = 'default') {
  if (keyOrHex.startsWith('#')) return keyOrHex;
  return COLORS[keyOrHex] ?? COLORS.default;
}

function hexToInt(hex) {
  return parseInt(String(hex).replace('#', ''), 16);
}

function getColorInt(keyOrHex = 'default') {
  return hexToInt(resolveColor(keyOrHex));
}

module.exports = { COLORS, resolveColor, hexToInt, getColorInt };
