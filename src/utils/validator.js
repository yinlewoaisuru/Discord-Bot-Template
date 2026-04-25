function isValidId(id) {
  return /^\d{17,19}$/.test(id);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidHex(hex) {
  return /^#?[0-9A-Fa-f]{6}$/.test(hex);
}

function isValidEmoji(str) {
  return /^<a?:\w+:\d+>$/.test(str) || /^\p{Emoji}/u.test(str);
}

function sanitizeInput(str, maxLength = 2000) {
  return String(str)
    .replace(/@everyone/gi, '@\u200beveryone')
    .replace(/@here/gi, '@\u200bhere')
    .slice(0, maxLength);
}

function validateArgs(args, min = 0, max = Infinity) {
  if (args.length < min) return { valid: false, error: `Cần ít nhất ${min} tham số.` };
  if (args.length > max) return { valid: false, error: `Tối đa ${max} tham số.` };
  return { valid: true, error: null };
}

function parseNumber(input, min = -Infinity, max = Infinity) {
  const num = Number(input);
  if (isNaN(num)) return { valid: false, value: null, error: 'Không phải số hợp lệ.' };
  if (num < min || num > max) return { valid: false, value: null, error: `Số phải từ ${min} đến ${max}.` };
  return { valid: true, value: num, error: null };
}

module.exports = {
  isValidId,
  isValidUrl,
  isValidHex,
  isValidEmoji,
  sanitizeInput,
  validateArgs,
  parseNumber,
};
