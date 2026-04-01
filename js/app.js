// NextGen Game Radar - Core Application Logic

const App = {
  state: {
    period: 'this',
    platforms: ['all'],
    genres: ['all'],
    sort: '-released',
    page: 1,
    nextPageUrl: null,
    games: [],
    allGenres: []
  },

  init() {
    // Initialize modules
    I18N.init();
    Analytics.init();
    Ads.init();

    // Parse URL params for shareable state
    this.loadStateFromURL();

    // Set up event listeners
    this.bindEvents();

    // Load genres then load games
    this.loadGenres();
    this.loadGames();
    this.updateMonthTitle();
  },

  loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('period')) this.state.period = params.get('period');
    if (params.get('platforms')) this.state.platforms = params.get('platforms').split(',');
    if (params.get('genres')) this.state.genres = params.get('genres').split(',');
    if (params.get('sort')) this.state.sort = params.get('sort');

    // Update UI to match state
    document.querySelectorAll('.month-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.period === this.state.period);
      btn.setAttribute('aria-selected', btn.dataset.period === this.state.period);
    });

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = this.state.sort;
  },

  updateURL() {
    const params = new URLSearchParams();
    if (this.state.period !== 'this') params.set('period', this.state.period);
    if (!this.state.platforms.includes('all')) params.set('platforms', this.state.platforms.join(','));
    if (!this.state.genres.includes('all')) params.set('genres', this.state.genres.join(','));
    if (this.state.sort !== '-released') params.set('sort', this.state.sort);

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    history.replaceState(null, '', newUrl);
  },

  bindEvents() {
    // Month toggle
    document.querySelectorAll('.month-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.month-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        this.state.period = btn.dataset.period;
        this.state.page = 1;
        this.state.games = [];
        this.updateMonthTitle();
        this.loadGames();
        this.updateURL();
        Analytics.trackFilterChange('period', this.state.period);
      });
    });

    // Platform filter
    document.getElementById('platformFilter').addEventListener('click', (e) => {
      const btn = e.target.closest('.platform-btn');
      if (!btn) return;

      const platform = btn.dataset.platform;

      if (platform === 'all') {
        this.state.platforms = ['all'];
        document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      } else {
        this.state.platforms = this.state.platforms.filter(p => p !== 'all');
        if (this.state.platforms.includes(platform)) {
          this.state.platforms = this.state.platforms.filter(p => p !== platform);
          btn.classList.remove('active');
        } else {
          this.state.platforms.push(platform);
          btn.classList.add('active');
        }
        if (this.state.platforms.length === 0) {
          this.state.platforms = ['all'];
          document.querySelector('.platform-btn[data-platform="all"]').classList.add('active');
        }
        document.querySelector('.platform-btn[data-platform="all"]').classList.toggle(
          'active', this.state.platforms.includes('all')
        );
      }

      this.state.page = 1;
      this.state.games = [];
      this.loadGames();
      this.updateURL();
      Analytics.trackFilterChange('platform', this.state.platforms.join(','));
    });

    // Genre filter
    document.getElementById('genreFilter').addEventListener('click', (e) => {
      const btn = e.target.closest('.genre-btn');
      if (!btn) return;

      const genre = btn.dataset.genre;

      if (genre === 'all') {
        this.state.genres = ['all'];
        document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      } else {
        this.state.genres = this.state.genres.filter(g => g !== 'all');
        if (this.state.genres.includes(genre)) {
          this.state.genres = this.state.genres.filter(g => g !== genre);
          btn.classList.remove('active');
        } else {
          this.state.genres.push(genre);
          btn.classList.add('active');
        }
        if (this.state.genres.length === 0) {
          this.state.genres = ['all'];
          document.querySelector('.genre-btn[data-genre="all"]').classList.add('active');
        }
        document.querySelector('.genre-btn[data-genre="all"]').classList.toggle(
          'active', this.state.genres.includes('all')
        );
      }

      this.state.page = 1;
      this.state.games = [];
      this.loadGames();
      this.updateURL();
      Analytics.trackFilterChange('genre', this.state.genres.join(','));
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      this.state.sort = e.target.value;
      this.state.page = 1;
      this.state.games = [];
      this.loadGames();
      this.updateURL();
      Analytics.trackFilterChange('sort', this.state.sort);
    });

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', () => {
      this.state.platforms = ['all'];
      this.state.genres = ['all'];
      this.state.sort = '-released';
      this.state.page = 1;
      this.state.games = [];

      document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.platform-btn[data-platform="all"]').classList.add('active');
      document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.genre-btn[data-genre="all"]').classList.add('active');
      document.getElementById('sortSelect').value = '-released';

      this.loadGames();
      this.updateURL();
    });

    // Load more
    document.getElementById('loadMore').addEventListener('click', () => {
      this.state.page++;
      this.loadGames(true);
    });

    // Modal close
    document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('gameModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    // Mobile menu
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.toggle('hidden');
    });

    // Social sharing
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => this.shareAction(btn.dataset.share));
    });
    document.getElementById('shareReleases').addEventListener('click', () => {
      this.shareAction('twitter', `Check out upcoming game releases on NextGen Game Radar!`);
    });
  },

  updateMonthTitle() {
    const titleEl = document.getElementById('monthTitle');
    if (titleEl) {
      titleEl.textContent = API.getMonthName(this.state.period);
    }
  },

  async loadGenres() {
    try {
      const data = await API.fetchGenres();
      if (data && data.results) {
        this.state.allGenres = data.results;
        this.renderGenreButtons(data.results);
      }
    } catch (err) {
      console.error('Failed to load genres:', err);
      // Fallback genres
      const fallback = [
        { id: 4, name: 'Action', slug: 'action' },
        { id: 5, name: 'RPG', slug: 'role-playing-games-rpg' },
        { id: 3, name: 'Adventure', slug: 'adventure' },
        { id: 2, name: 'Shooter', slug: 'shooter' },
        { id: 10, name: 'Strategy', slug: 'strategy' },
        { id: 15, name: 'Sports', slug: 'sports' },
        { id: 7, name: 'Puzzle', slug: 'puzzle' },
        { id: 51, name: 'Indie', slug: 'indie' }
      ];
      this.state.allGenres = fallback;
      this.renderGenreButtons(fallback);
    }
  },

  renderGenreButtons(genres) {
    const container = document.getElementById('genreFilter');
    const topGenres = ['action', 'role-playing-games-rpg', 'adventure', 'shooter', 'strategy', 'sports', 'puzzle', 'indie'];
    const filtered = genres.filter(g => topGenres.includes(g.slug)).slice(0, 8);

    filtered.forEach(genre => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn genre-btn';
      btn.dataset.genre = genre.id;
      btn.textContent = genre.name;
      if (this.state.genres.includes(genre.id.toString())) {
        btn.classList.add('active');
      }
      container.appendChild(btn);
    });
  },

  async loadGames(append = false) {
    const grid = document.getElementById('gameGrid');
    const noGames = document.getElementById('noGames');
    const loadMoreBtn = document.getElementById('loadMore');
    const topRatedSection = document.getElementById('topRatedSection');

    if (!append) {
      grid.innerHTML = this.getSkeletonHTML();
      noGames.classList.add('hidden');
      loadMoreBtn.classList.add('hidden');
      topRatedSection.classList.add('hidden');
    }

    try {
      const params = {
        dates: API.getDateRange(this.state.period),
        ordering: this.state.sort,
        page: this.state.page,
        page_size: 20
      };

      if (!this.state.platforms.includes('all')) {
        params.platforms = this.state.platforms.join(',');
      }
      if (!this.state.genres.includes('all')) {
        params.genres = this.state.genres.join(',');
      }

      const data = await API.fetchUpcomingGames(params);

      if (data && data.results) {
        if (append) {
          this.state.games = [...this.state.games, ...data.results];
        } else {
          this.state.games = data.results;
        }

        this.state.nextPageUrl = data.next;
        this.renderGames(this.state.games, append);

        // Show/hide load more
        if (data.next) {
          loadMoreBtn.classList.remove('hidden');
        } else {
          loadMoreBtn.classList.add('hidden');
        }

        // Top rated section
        if (!append && this.state.sort === '-released') {
          const topRated = this.state.games.filter(g => g.metacritic && g.metacritic >= 85);
          if (topRated.length > 0) {
            topRatedSection.classList.remove('hidden');
            this.renderTopRated(topRated);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load games:', err);
      grid.innerHTML = `<div class="col-span-full text-center py-12"><p class="text-text-secondary">${I18N.t('error_loading')}</p></div>`;
    }
  },

  renderGames(games, append = false) {
    const grid = document.getElementById('gameGrid');
    const noGames = document.getElementById('noGames');

    if (games.length === 0) {
      grid.innerHTML = '';
      noGames.classList.remove('hidden');
      return;
    }

    noGames.classList.add('hidden');

    if (!append) {
      grid.innerHTML = '';
    } else {
      // Remove skeleton cards if appending
      grid.querySelectorAll('.skeleton-card').forEach(s => s.remove());
    }

    games.forEach((game, index) => {
      // Skip if already rendered (for append)
      if (append && index < games.length - 20) return;

      const card = this.createGameCard(game);
      grid.appendChild(card);
    });

    // Inject in-feed ad
    Ads.injectInFeedAd(grid);
  },

  createGameCard(game) {
    const card = document.createElement('article');
    card.className = 'game-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${game.name} - ${game.released ? I18N.formatDate(game.released) : I18N.t('tbd')}`);

    const coverUrl = game.background_image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" fill="%23374151"%3E%3Crect width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236B7280" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';

    const scoreHTML = this.getScoreBadgeHTML(game.metacritic);
    const platformsHTML = this.getPlatformBadgesHTML(game.platforms || []);
    const genresHTML = this.getGenreTagsHTML(game.genres || []);

    card.innerHTML = `
      <img class="cover-image" src="${coverUrl}" alt="${game.name} cover art" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22 fill=%22%23374151%22%3E%3Crect width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236B7280%22 font-family=%22sans-serif%22 font-size=%2214%22%3ENo Image%3C/text%3E%3C/svg%3E'">
      <div class="card-body">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="game-title">${this.escapeHTML(game.name)}</h3>
          ${scoreHTML}
        </div>
        <p class="release-date mb-2">
          <svg class="w-3 h-3 inline-block mr-1 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          ${game.released ? I18N.formatDate(game.released) : I18N.t('tbd')}
        </p>
        <div class="flex flex-wrap gap-1 mb-2">${platformsHTML}</div>
        <div class="flex flex-wrap gap-1">${genresHTML}</div>
      </div>
    `;

    card.addEventListener('click', () => this.openModal(game));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openModal(game);
      }
    });

    return card;
  },

  getScoreBadgeHTML(score) {
    if (!score) {
      return `<span class="score-badge score-gray flex-shrink-0" aria-label="Score: TBD">${I18N.t('tbd')}</span>`;
    }
    let cls = 'score-green';
    if (score < 50) cls = 'score-red';
    else if (score < 75) cls = 'score-amber';
    return `<span class="score-badge ${cls} flex-shrink-0" aria-label="Metacritic score: ${score}">${score}</span>`;
  },

  getPlatformBadgesHTML(platforms) {
    if (!platforms || platforms.length === 0) return '';
    const knownPlatforms = { 4: 'PC', 187: 'PS5', 186: 'Xbox', 7: 'Switch', 18: 'PS4', 1: 'Xbox One', 3: 'iOS', 21: 'Android' };
    const seen = new Set();
    return platforms
      .map(p => {
        const id = p.platform ? p.platform.id : p.id;
        const name = knownPlatforms[id] || (p.platform ? p.platform.name : p.name);
        if (!name || seen.has(name)) return '';
        seen.add(name);
        return `<span class="platform-badge">${this.escapeHTML(name)}</span>`;
      })
      .filter(Boolean)
      .slice(0, 4)
      .join('');
  },

  getGenreTagsHTML(genres) {
    if (!genres || genres.length === 0) return '';
    return genres
      .slice(0, 3)
      .map(g => `<span class="genre-tag">${this.escapeHTML(g.name)}</span>`)
      .join('');
  },

  renderTopRated(games) {
    const grid = document.getElementById('topRatedGrid');
    grid.innerHTML = '';
    games.slice(0, 4).forEach(game => {
      grid.appendChild(this.createGameCard(game));
    });
  },

  async openModal(game) {
    const modal = document.getElementById('gameModal');
    Analytics.trackGameClick(game.name);

    // Set basic info from list data
    document.getElementById('modalImage').src = game.background_image || '';
    document.getElementById('modalImage').alt = game.name;
    document.getElementById('modalTitle').textContent = game.name;
    document.getElementById('modalDescription').textContent = '';
    document.getElementById('modalScore').innerHTML = this.getScoreBadgeHTML(game.metacritic);
    document.getElementById('modalPlatforms').innerHTML = this.getPlatformBadgesHTML(game.platforms || []);
    document.getElementById('modalGenres').innerHTML = this.getGenreTagsHTML(game.genres || []);

    document.getElementById('modalMeta').innerHTML = `
      <span class="text-sm text-text-secondary">
        <svg class="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        ${game.released ? I18N.formatDate(game.released) : I18N.t('tbd')}
      </span>
    `;

    // Share buttons for this game
    document.getElementById('modalShareBtns').innerHTML = `
      <button class="share-btn text-xs bg-card hover:bg-border-dark text-text-secondary px-3 py-1.5 rounded-lg transition-colors border border-border-dark" onclick="App.shareGame('twitter', '${this.escapeHTML(game.name)}')" aria-label="Share on Twitter">Share on X</button>
      <button class="share-btn text-xs bg-card hover:bg-border-dark text-text-secondary px-3 py-1.5 rounded-lg transition-colors border border-border-dark" onclick="App.shareGame('facebook', '${this.escapeHTML(game.name)}')" aria-label="Share on Facebook">Share on Facebook</button>
      <button class="share-btn text-xs bg-card hover:bg-border-dark text-text-secondary px-3 py-1.5 rounded-lg transition-colors border border-border-dark" onclick="App.shareGame('copy', '${this.escapeHTML(game.name)}')" aria-label="Copy link">Copy Link</button>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Fetch full details
    try {
      const details = await API.fetchGameDetails(game.id);
      if (details) {
        const desc = details.description_raw || details.description || '';
        document.getElementById('modalDescription').textContent = desc.replace(/<[^>]+>/g, '').slice(0, 500);
        if (details.background_image_additional) {
          document.getElementById('modalImage').src = details.background_image_additional;
        }
      }
    } catch {
      // Keep basic info
    }
  },

  closeModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('show');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  },

  shareAction(platform, text = '') {
    const url = window.location.href;
    const defaultText = text || 'Check out NextGen Game Radar - Upcoming Video Games & Metacritic Scores!';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(defaultText)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'reddit':
        window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(defaultText)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          this.showToast(I18N.t('copied'));
        }).catch(() => {
          // Fallback
          const input = document.createElement('input');
          input.value = url;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          this.showToast(I18N.t('copied'));
        });
        break;
    }
  },

  shareGame(platform, gameName) {
    const url = window.location.href;
    const text = `Check out ${gameName} on NextGen Game Radar!`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => this.showToast(I18N.t('copied')));
        break;
    }
  },

  showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  },

  getSkeletonHTML() {
    return Array(8).fill('').map(() => `
      <div class="skeleton-card bg-card rounded-xl overflow-hidden animate-pulse">
        <div class="h-48 bg-border-dark"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-border-dark rounded w-3/4"></div>
          <div class="h-3 bg-border-dark rounded w-1/2"></div>
          <div class="h-3 bg-border-dark rounded w-1/3"></div>
        </div>
      </div>
    `).join('');
  },

  escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
