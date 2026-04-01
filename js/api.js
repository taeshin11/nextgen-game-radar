// NextGen Game Radar - RAWG API Client

const API = {
  BASE_URL: 'https://api.rawg.io/api',
  // To use real data, register at https://rawg.io/apidocs and paste your key here
  API_KEY: 'b0f8de7b2a5c4e3f8c1d9e7a6b3f2c1d',
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  callCount: 0,
  useFallback: false,

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
      sessionStorage.clear();
    }
  },

  async fetch(endpoint, params = {}) {
    if (this.useFallback) {
      return this.getFallbackData(endpoint, params);
    }

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
        console.warn(`RAWG API returned ${response.status}, switching to demo data`);
        this.useFallback = true;
        return this.getFallbackData(endpoint, params);
      }
      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.warn('RAWG API unavailable, using demo data:', error.message);
      this.useFallback = true;
      return this.getFallbackData(endpoint, params);
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
        end = new Date(year, month + 8, 0);
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
  },

  // Fallback demo data for when API is unavailable
  getFallbackData(endpoint, params) {
    if (endpoint === '/genres') {
      return this._fallbackGenres();
    }
    if (endpoint.startsWith('/games/') && !endpoint.endsWith('/games')) {
      return this._fallbackGameDetail();
    }
    return this._fallbackGames(params);
  },

  _fallbackGenres() {
    return {
      count: 8,
      results: [
        { id: 4, name: 'Action', slug: 'action' },
        { id: 5, name: 'RPG', slug: 'role-playing-games-rpg' },
        { id: 3, name: 'Adventure', slug: 'adventure' },
        { id: 2, name: 'Shooter', slug: 'shooter' },
        { id: 10, name: 'Strategy', slug: 'strategy' },
        { id: 15, name: 'Sports', slug: 'sports' },
        { id: 7, name: 'Puzzle', slug: 'puzzle' },
        { id: 51, name: 'Indie', slug: 'indie' }
      ]
    };
  },

  _fallbackGameDetail() {
    return {
      id: 1,
      name: 'Demo Game',
      description_raw: 'This is a demo game entry. To see real game data, please register for a free RAWG API key at rawg.io/apidocs and add it to js/api.js.',
      background_image: null,
      background_image_additional: null
    };
  },

  _fallbackGames(params) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const imgs = [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop'
    ];

    const demoGames = [
      { name: 'Elden Ring: Nightreign', metacritic: 92, genres: [{ name: 'Action' }, { name: 'RPG' }], platformIds: [4, 187, 186] },
      { name: 'Grand Theft Auto VI', metacritic: null, genres: [{ name: 'Action' }, { name: 'Adventure' }], platformIds: [187, 186] },
      { name: 'Fable', metacritic: null, genres: [{ name: 'RPG' }, { name: 'Adventure' }], platformIds: [4, 186] },
      { name: 'Death Stranding 2: On the Beach', metacritic: 88, genres: [{ name: 'Action' }, { name: 'Adventure' }], platformIds: [187] },
      { name: 'Metroid Prime 4: Beyond', metacritic: null, genres: [{ name: 'Action' }, { name: 'Adventure' }], platformIds: [7] },
      { name: 'Doom: The Dark Ages', metacritic: 90, genres: [{ name: 'Shooter' }, { name: 'Action' }], platformIds: [4, 187, 186] },
      { name: 'Monster Hunter Wilds', metacritic: 87, genres: [{ name: 'Action' }, { name: 'RPG' }], platformIds: [4, 187, 186] },
      { name: 'Civilization VII', metacritic: 82, genres: [{ name: 'Strategy' }], platformIds: [4, 187, 186, 7] },
      { name: 'Hollow Knight: Silksong', metacritic: null, genres: [{ name: 'Action' }, { name: 'Indie' }], platformIds: [4, 7] },
      { name: 'Ghost of Yotei', metacritic: null, genres: [{ name: 'Action' }, { name: 'Adventure' }], platformIds: [187] },
      { name: 'Assassin\'s Creed Shadows', metacritic: 78, genres: [{ name: 'Action' }, { name: 'RPG' }], platformIds: [4, 187, 186] },
      { name: 'Avowed', metacritic: 80, genres: [{ name: 'RPG' }, { name: 'Adventure' }], platformIds: [4, 186] },
      { name: 'Like a Dragon: Pirate Yakuza in Hawaii', metacritic: 85, genres: [{ name: 'Action' }, { name: 'RPG' }], platformIds: [4, 187, 186] },
      { name: 'Judas', metacritic: null, genres: [{ name: 'Shooter' }, { name: 'RPG' }], platformIds: [4, 187, 186] },
      { name: 'The Outer Worlds 2', metacritic: null, genres: [{ name: 'RPG' }, { name: 'Shooter' }], platformIds: [4, 186] },
      { name: 'Borderlands 4', metacritic: null, genres: [{ name: 'Shooter' }, { name: 'RPG' }], platformIds: [4, 187, 186] },
      { name: 'Pokemon Legends: Z-A', metacritic: null, genres: [{ name: 'RPG' }, { name: 'Adventure' }], platformIds: [7] },
      { name: 'South of Midnight', metacritic: null, genres: [{ name: 'Adventure' }, { name: 'Action' }], platformIds: [4, 186] },
      { name: 'Split Fiction', metacritic: 86, genres: [{ name: 'Action' }, { name: 'Adventure' }], platformIds: [4, 187, 186] },
      { name: 'Clair Obscur: Expedition 33', metacritic: null, genres: [{ name: 'RPG' }], platformIds: [4, 187, 186] }
    ];

    const platformMap = {
      4: { id: 4, name: 'PC', slug: 'pc' },
      187: { id: 187, name: 'PlayStation 5', slug: 'playstation5' },
      186: { id: 186, name: 'Xbox Series S/X', slug: 'xbox-series-x' },
      7: { id: 7, name: 'Nintendo Switch', slug: 'nintendo-switch' }
    };

    // Filter by platform if specified
    let filtered = [...demoGames];
    if (params.platforms) {
      const pIds = params.platforms.split(',').map(Number);
      filtered = filtered.filter(g => g.platformIds.some(p => pIds.includes(p)));
    }

    // Filter by genre if specified
    if (params.genres) {
      const gIds = params.genres.split(',').map(Number);
      const genreMap = { 4: 'Action', 5: 'RPG', 3: 'Adventure', 2: 'Shooter', 10: 'Strategy', 15: 'Sports', 7: 'Puzzle', 51: 'Indie' };
      const genreNames = gIds.map(id => genreMap[id]).filter(Boolean);
      if (genreNames.length > 0) {
        filtered = filtered.filter(g => g.genres.some(genre => genreNames.includes(genre.name)));
      }
    }

    // Sort
    if (params.ordering === '-metacritic') {
      filtered.sort((a, b) => (b.metacritic || 0) - (a.metacritic || 0));
    } else if (params.ordering === 'metacritic') {
      filtered.sort((a, b) => (a.metacritic || 0) - (b.metacritic || 0));
    } else if (params.ordering === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    const results = filtered.map((g, i) => {
      const day = Math.min(28, (i * 3) + 1);
      const releaseMonth = month;
      const releaseDate = `${year}-${String(releaseMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      return {
        id: 100000 + i,
        name: g.name,
        released: releaseDate,
        background_image: imgs[i % imgs.length],
        metacritic: g.metacritic,
        platforms: g.platformIds.map(pid => ({ platform: platformMap[pid] })),
        genres: g.genres,
        rating: g.metacritic ? (g.metacritic / 20).toFixed(1) : null
      };
    });

    return {
      count: results.length,
      next: null,
      previous: null,
      results: results
    };
  }
};
