const { API_MAX_RETRIES, RETRY_BASE_DELAY, RETRY_MAX_DELAY, API_TIMEOUT } = require('../config/constants.config');
const logger = require('./logger');

async function retryFetch(url, options = {}) {
  const maxRetries = options.maxRetries ?? API_MAX_RETRIES;
  const baseDelay = options.baseDelay ?? RETRY_BASE_DELAY;
  const maxDelay = options.maxDelay ?? RETRY_MAX_DELAY;
  const timeout = options.timeout ?? API_TIMEOUT;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok && attempt < maxRetries) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        const jitter = delay * (0.5 + Math.random() * 0.5);
        await new Promise(r => setTimeout(r, jitter));
      }
    }
  }

  logger.error(`[RetryFetch] Failed after ${maxRetries + 1} attempts: ${url}`);
  throw lastError;
}

module.exports = { retryFetch };
