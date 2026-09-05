/**
 * Bhoomi Client
 * Handles HTTP requests and session management for Karnataka Bhoomi citizen portal endpoints.
 */

const BHOOMI_CITIZEN_PORTAL_URL = 'https://landrecords.karnataka.gov.in/service2/forM16A.aspx';
const BHOOMI_RTC_PAGE_URL = 'https://landrecords.karnataka.gov.in/service2/forM16A.aspx';

const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  timeout: 10000
});

function fetchBhoomiHtml(url, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        agent: httpsAgent,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: timeoutMs
      },
      (res) => {
        let html = '';
        res.on('data', (chunk) => {
          html += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            statusText: res.statusMessage || '',
            html,
            ok: res.statusCode >= 200 && res.statusCode < 300
          });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Bhoomi request timed out'));
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Checks connectivity and session security requirements for official Bhoomi portal
 */
async function checkBhoomiPortalConnectivity() {
  const startTime = Date.now();

  try {
    const response = await fetchBhoomiHtml(BHOOMI_CITIZEN_PORTAL_URL, 10000);
    const responseTimeMs = Date.now() - startTime;
    const html = response.html || '';

    const requiresCaptcha = html.includes('Captcha') || html.includes('captcha') || html.includes('CAPTCHA');
    const requiresViewState = html.includes('__VIEWSTATE') || html.includes('__EVENTVALIDATION');

    return {
      endpoint: BHOOMI_CITIZEN_PORTAL_URL,
      method: 'GET',
      statusCode: response.statusCode,
      statusText: response.statusText,
      responseTimeMs,
      timestamp: new Date().toISOString(),
      requiresCaptcha,
      requiresViewState,
      htmlLength: html.length,
      isAccessible: response.ok
    };
  } catch (error) {
    const responseTimeMs = Date.now() - startTime;
    return {
      endpoint: BHOOMI_CITIZEN_PORTAL_URL,
      method: 'GET',
      statusCode: error.message.includes('timed out') ? 408 : 503,
      statusText: error.message.includes('timed out') ? 'Timeout' : 'Network Error',
      responseTimeMs,
      timestamp: new Date().toISOString(),
      requiresCaptcha: true,
      requiresViewState: true,
      error: error.message,
      isAccessible: false
    };
  }
}

module.exports = {
  BHOOMI_CITIZEN_PORTAL_URL,
  BHOOMI_RTC_PAGE_URL,
  checkBhoomiPortalConnectivity
};
