/**
 * Bhoomi Parser
 * Parses raw HTML / JSON responses returned by Bhoomi RTC lookup endpoints.
 */

function normalizeValue(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str === '' ? null : str;
}

/**
 * Parses raw HTML / text from Bhoomi RTC responses into structured owner records
 */
function parseBhoomiRtcHtml(htmlText, propertyContext = {}) {
  if (!htmlText || typeof htmlText !== 'string') return [];

  const records = [];

  // Regex matches for common Bhoomi RTC table fields if returned in HTML
  const ownerMatches = htmlText.match(/<td[^>]*class="[^"]*owner[^"]*"[^>]*>(.*?)<\/td>/gi);
  if (ownerMatches && ownerMatches.length > 0) {
    ownerMatches.forEach((m, idx) => {
      const name = m.replace(/<[^>]+>/g, '').trim();
      if (name) {
        records.push({
          recordId: idx + 1,
          ownerName: name,
          ownerType: 'Recorded Holder',
          surveyNumber: propertyContext.surveyNumber || 'Not specified',
          surnoc: propertyContext.surnoc || 'Not returned by source',
          hissaNumber: propertyContext.hissaNumber || 'Not returned by source',
          extent: propertyContext.area || 'Not returned by source',
          classification: propertyContext.category || 'Agricultural',
          recordDate: new Date().toISOString().split('T')[0]
        });
      }
    });
  }

  return records;
}

module.exports = {
  parseBhoomiRtcHtml
};
