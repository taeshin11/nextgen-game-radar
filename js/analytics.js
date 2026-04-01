// NextGen Game Radar - Analytics & Visitor Counter

const Analytics = {
  WEBHOOK_URL: '', // Set your Google Sheets Apps Script URL here
  debounceTimers: {},

  init() {
    this.updateVisitorCounter();
    this.trackPageLoad();
  },

  // Visitor Counter
  updateVisitorCounter() {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('ngr_visit_date');
    let todayCount = parseInt(localStorage.getItem('ngr_today_count') || '0');
    let totalCount = parseInt(localStorage.getItem('ngr_total_count') || '0');

    if (storedDate !== today) {
      todayCount = 0;
      localStorage.setItem('ngr_visit_date', today);
    }

    todayCount++;
    totalCount++;

    localStorage.setItem('ngr_today_count', todayCount.toString());
    localStorage.setItem('ngr_total_count', totalCount.toString());

    const todayEl = document.getElementById('todayCount');
    const totalEl = document.getElementById('totalCount');
    if (todayEl) todayEl.textContent = todayCount.toLocaleString();
    if (totalEl) totalEl.textContent = totalCount.toLocaleString();
  },

  // Google Sheets Webhook
  async sendToWebhook(action, detail = '') {
    if (!this.WEBHOOK_URL) return;

    const payload = {
      timestamp: new Date().toISOString(),
      action: action,
      detail: detail,
      language: I18N ? I18N.currentLang : 'en',
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent
    };

    try {
      await window.fetch(this.WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Silent fail - non-blocking
    }
  },

  debounced(key, fn, delay = 1000) {
    if (this.debounceTimers[key]) {
      clearTimeout(this.debounceTimers[key]);
    }
    this.debounceTimers[key] = setTimeout(fn, delay);
  },

  trackPageLoad() {
    this.sendToWebhook('page_load', window.location.href);
  },

  trackFilterChange(filterType, value) {
    this.debounced('filter_' + filterType, () => {
      this.sendToWebhook('filter_change', `${filterType}: ${value}`);
    });
  },

  trackGameClick(gameName) {
    this.sendToWebhook('game_click', gameName);
  }
};

// Google Sheets Apps Script Code (for reference):
/*
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.action,
    data.detail,
    data.language,
    data.referrer,
    data.userAgent
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
*/
