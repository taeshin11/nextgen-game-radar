// NextGen Game Radar - RAWG API Client

const API = {
  BASE_URL: 'https://api.rawg.io/api',
  API_KEY: 'b0f8de7b2a5c4e3f8c1d9e7a6b3f2c1d', // Free tier key
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  callCount: 0,

  // Platform ID mapping for RAWG API
  PLATFORMS: {
    '4': { name: 'PC', slug: 'pc' },
    '187': { name: 'PS5', slug: 'playstation5' },
    '186': { name: 'Xbox Series S/X', slug: 'xbox-series-x' },
    '7': { name: 'Nintendo Switch', slug: 'nintendo-switch' }
  },

  getCacheKey(endpoint, params) {
    return `ngr_${endpoint}_${JSON.stringify(params)}`;
  },

  getFromCache(key) {
    try {
      const cached = sessionStorage.getItem(key);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_TTL) {
        sessionStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  setCache(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      // Storage full, clear old entries
      sessionStorage.clear();
    }
  },

  async fetch(endpoint, params = {}) {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const url = new URL(`${this.BASE_URL}${endpoint}`);
    url.searchParams.set('key', this.API_KEY);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') {
        url.searchParams.set(k, v);
      }
    });

    this.callCount++;

    try {
      const response = await window.fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('RAWG API Error:', error);
      throw error;
    }
  },

  async fetchUpcomingGames(params = {}) {
    const defaults = {
      page_size: 20,
      ordering: '-released',
      page: 1
    };
    return this.fetch('/games', { ...defaults, ...params });
  },

  async fetchGameDetails(id) {
    return this.fetch(`/games/${id}`);
  },

  async fetchGenres() {
    return this.fetch('/genres', { page_size: 40 });
  },

  async fetchPlatforms() {
    return this.fetch('/platforms', { page_size: 50 });
  },

  getDateRange(period) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    let start, end;

    switch (period) {
      case 'this':
        start = new Date(year, month, 1);
        end = new Date(year, month + 1, 0);
        break;
      case 'next':
        start = new Date(year, month + 1, 1);
        end = new Date(year, month + 2, 0);
        break;
      case 'coming':
        start = new Date(year, month + 2, 1);
        end = new Date(year, month + 8, 0); // 6 months ahead
        break;
      default:
        start = new Date(year, month, 1);
        end = new Date(year, month + 1, 0);
    }

    const fmt = d => d.toISOString().split('T')[0];
    return `${fmt(start)},${fmt(end)}`;
  },

  getMonthName(period) {
    const now = new Date();
    const lang = I18N ? I18N.currentLang : 'en';
    const opts = { month: 'long', year: 'numeric' };

    switch (period) {
      case 'this':
        return new Intl.DateTimeFormat(lang, opts).format(now);
      case 'next': {
        const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return new Intl.DateTimeFormat(lang, opts).format(next);
      }
      case 'coming':
        return I18N ? I18N.t('coming_soon') : 'Coming Soon';
      default:
        return new Intl.DateTimeFormat(lang, opts).format(now);
    }
  }
};
