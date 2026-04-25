const axios = require('axios');
const { API_TIMEOUT, API_MAX_RETRIES, RETRY_BASE_DELAY } = require('../config/constants.config');
const logger = require('./logger');

const client = axios.create({
  timeout: API_TIMEOUT,
  headers: { 'User-Agent': 'NovelaBot/3.0' },
});

async function request(url, options = {}) {
  const maxRetries = options.retries ?? API_MAX_RETRIES;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await client({
        url,
        method: options.method || 'GET',
        data: options.data,
        params: options.params,
        headers: options.headers,
        responseType: options.responseType || 'json',
      });
      return response.data;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  logger.error(`[API] Failed after ${maxRetries + 1} attempts: ${url}`, lastError.message);
  throw lastError;
}

async function get(url, params, options = {}) {
  return request(url, { ...options, method: 'GET', params });
}

async function post(url, data, options = {}) {
  return request(url, { ...options, method: 'POST', data });
}

module.exports = { request, get, post };
