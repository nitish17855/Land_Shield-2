/**
 * Bhoomi Client
 * Handles HTTP requests and session management for Karnataka Bhoomi citizen portal endpoints.
 */

const BHOOMI_CITIZEN_PORTAL_URL = 'https://landrecords.karnataka.gov.in/service2/forM16A.aspx';
const BHOOMI_RTC_PAGE_URL = 'https://landrecords.karnataka.gov.in/service2/forM16A.aspx';

/**
 * Checks connectivity and session security requirements for official Bhoomi portal
 */
async function checkBhoomiPortalConnectivity() {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(BHOOMI_CITIZEN_PORTAL_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const responseTimeMs = Date.now() - startTime;
    const html = await response.text();

    const requiresCaptcha = html.includes('Captcha') || html.includes('captcha') || html.includes('CAPTCHA');
    const requiresViewState = html.includes('__VIEWSTATE') || html.includes('__EVENTVALIDATION');

    return {
      endpoint: BHOOMI_CITIZEN_PORTAL_URL,
      method: 'GET',
      statusCode: response.status,
      statusText: response.statusText,
      responseTimeMs,
      timestamp: new Date().toISOString(),
      requiresCaptcha,
      requiresViewState,
      htmlLength: html.length,
      isAccessible: response.ok
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      endpoint: BHOOMI_CITIZEN_PORTAL_URL,
      method: 'GET',
      statusCode: error.name === 'AbortError' ? 408 : 503,
      statusText: error.name === 'AbortError' ? 'Timeout' : 'Network Error',
      responseTimeMs: Date.now() - startTime,
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
