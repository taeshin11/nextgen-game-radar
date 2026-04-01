# PRD: NextGen Game Radar

## Upcoming Video Games & Metacritic Scores

---

## 1. Product Overview

### Service Name
NextGen Game Radar

### Short Title
Upcoming Video Games & Metacritic Scores

### Description
NextGen Game Radar is a dashboard displaying upcoming video game releases and latest review scores across PC, PlayStation, Xbox, and Nintendo Switch. Powered by the RAWG Video Games Database API (free tier with generous limits), it provides gamers and industry followers with an at-a-glance view of what is coming next, filtered by platform, genre, and release window.

### Target Audience
- Casual and hardcore gamers tracking release dates
- Gaming journalists and content creators
- Game industry professionals monitoring the market
- Parents researching upcoming games

### Target Keywords (SEO)
- "upcoming games 2025"
- "new game releases"
- "metacritic scores"
- "upcoming PC games"
- "PS5 game releases"
- "Xbox game calendar"
- "Nintendo Switch new games"

---

## 2. Harness Design Methodology

### Agent Workflow

```
Planner Agent
  --> Analyze PRD, break into milestones and tasks
  --> Output: milestone_plan.json

Initializer Agent
  --> Generate feature_list.json
  --> Generate claude-progress.txt
  --> Generate init.sh (project scaffold)
  --> Bootstrap project structure

Fixed Session Routine
  --> Each session: read claude-progress.txt
  --> Pick next incomplete task
  --> Build -> Test -> Commit
  --> Update claude-progress.txt

Builder Agent
  --> Implements features per milestone
  --> Writes code, tests locally

Reviewer Agent
  --> Reviews code quality, accessibility, SEO
  --> Validates against PRD requirements
  --> Confirms milestone completion
```

### Initializer Agent Outputs

#### feature_list.json
```json
{
  "project": "NextGenGameRadar",
  "features": [
    {
      "id": "F01",
      "name": "Project Scaffold & Tailwind Setup",
      "milestone": 1,
      "status": "pending"
    },
    {
      "id": "F02",
      "name": "RAWG API Integration",
      "milestone": 1,
      "status": "pending"
    },
    {
      "id": "F03",
      "name": "Upcoming Releases Calendar/List View",
      "milestone": 2,
      "status": "pending"
    },
    {
      "id": "F04",
      "name": "Game Cards with Cover Art & Details",
      "milestone": 2,
      "status": "pending"
    },
    {
      "id": "F05",
      "name": "Platform Filter (PC, PS5, Xbox, Switch)",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F06",
      "name": "Genre Filter",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F07",
      "name": "This Month / Next Month Toggle",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F08",
      "name": "Metacritic Score Display & Sorting",
      "milestone": 4,
      "status": "pending"
    },
    {
      "id": "F09",
      "name": "Auto i18n (8+ Languages)",
      "milestone": 5,
      "status": "pending"
    },
    {
      "id": "F10",
      "name": "SEO Optimization",
      "milestone": 5,
      "status": "pending"
    },
    {
      "id": "F11",
      "name": "Ad Integration (Adsterra + AdSense)",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F12",
      "name": "Google Sheets Webhook",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F13",
      "name": "Visitor Counter (Today + Total)",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F14",
      "name": "Feedback & Social Sharing",
      "milestone": 7,
      "status": "pending"
    },
    {
      "id": "F15",
      "name": "Static Pages (About, FAQ, Privacy, Terms)",
      "milestone": 7,
      "status": "pending"
    },
    {
      "id": "F16",
      "name": "Deployment to Vercel",
      "milestone": 8,
      "status": "pending"
    }
  ]
}
```

#### claude-progress.txt
```
# NextGen Game Radar - Progress Tracker
# Updated: [timestamp]

## Current Milestone: 1
## Current Task: F01 - Project Scaffold & Tailwind Setup
## Status: NOT STARTED

### Milestone 1: Foundation [NOT STARTED]
- [ ] F01: Project Scaffold & Tailwind Setup
- [ ] F02: RAWG API Integration

### Milestone 2: Core Views [NOT STARTED]
- [ ] F03: Upcoming Releases Calendar/List View
- [ ] F04: Game Cards with Cover Art & Details

### Milestone 3: Filtering [NOT STARTED]
- [ ] F05: Platform Filter
- [ ] F06: Genre Filter
- [ ] F07: This Month / Next Month Toggle

### Milestone 4: Scores [NOT STARTED]
- [ ] F08: Metacritic Score Display & Sorting

### Milestone 5: SEO & i18n [NOT STARTED]
- [ ] F09: Auto i18n
- [ ] F10: SEO Optimization

### Milestone 6: Monetization & Analytics [NOT STARTED]
- [ ] F11: Ad Integration
- [ ] F12: Google Sheets Webhook
- [ ] F13: Visitor Counter

### Milestone 7: Content Pages & Social [NOT STARTED]
- [ ] F14: Feedback & Social Sharing
- [ ] F15: Static Pages

### Milestone 8: Deployment [NOT STARTED]
- [ ] F16: Deploy to Vercel

### Notes:
```

#### init.sh
```bash
#!/bin/bash
# NextGen Game Radar - Project Initializer

mkdir -p src/{css,js,images,pages}
touch src/index.html
touch src/css/styles.css
touch src/js/app.js
touch src/js/api.js
touch src/js/i18n.js
touch src/js/analytics.js
touch src/js/ads.js
touch src/pages/about.html
touch src/pages/faq.html
touch src/pages/privacy.html
touch src/pages/terms.html
touch src/sitemap.xml
touch src/robots.txt

echo "Project scaffold created."
```

---

## 3. Technical Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Markup | Vanilla HTML5 (semantic) |
| Styling | Tailwind CSS (CDN), custom CSS |
| Logic | Vanilla JavaScript (ES6+) |
| API | RAWG Video Games Database API (free tier) |
| Hosting | Vercel (free tier) |
| Ads | Adsterra (primary), Google AdSense (secondary) |
| Analytics | Google Sheets via Apps Script webhook |

### RAWG API Details
- Base URL: `https://api.rawg.io/api`
- Free tier: 20,000 requests/month
- Key endpoints:
  - `GET /games` - list games with filters
  - `GET /games/{id}` - game details
  - `GET /genres` - list genres
  - `GET /platforms` - list platforms
- Query parameters: `dates`, `platforms`, `genres`, `ordering`, `metacritic`, `page_size`
- API key obtained via rawg.io/apidocs (free registration)

### Infrastructure Cost
**$0 total** - RAWG free tier + Vercel free hosting.

### File Structure
```
NextGenGameRadar/
├── index.html                 # Main dashboard page
├── css/
│   └── styles.css             # Custom styles, soft palette, game theme
├── js/
│   ├── app.js                 # Core logic: rendering, state management
│   ├── api.js                 # RAWG API client, caching layer
│   ├── i18n.js                # Internationalization module
│   ├── analytics.js           # Visitor counter, Google Sheets webhook
│   └── ads.js                 # Ad slot injection
├── pages/
│   ├── about.html
│   ├── faq.html
│   ├── privacy.html
│   └── terms.html
├── images/
│   ├── og-image.png           # Open Graph image
│   ├── favicon.ico
│   └── platform-icons/        # PC, PS5, Xbox, Switch SVG icons
├── sitemap.xml
├── robots.txt
├── feature_list.json
├── claude-progress.txt
├── init.sh
├── vercel.json
└── README.md
```

---

## 4. Design System

### Color Palette (Soft Background - Gaming Theme)
| Role | Color | Hex |
|------|-------|-----|
| Background | Deep soft navy | #1A1F2E |
| Background Alt | Slightly lighter navy | #222838 |
| Surface/Card | Dark card | #2A3042 |
| Primary | Electric blue | #4E8FFF |
| Primary Hover | Brighter blue | #6BA3FF |
| Secondary | Soft purple | #9B6DFF |
| Accent | Neon green (scores) | #4ADE80 |
| Warning | Amber (avg scores) | #FBBF24 |
| Danger | Soft red (low scores) | #F87171 |
| Text Primary | Off-white | #E8E8EC |
| Text Secondary | Muted blue-gray | #8B95A8 |
| Border | Subtle dark border | #374151 |

### Metacritic Score Color Coding
- **75-100**: Green (#4ADE80) - Positive
- **50-74**: Amber (#FBBF24) - Mixed
- **0-49**: Red (#F87171) - Negative
- **No Score**: Gray (#6B7280) - TBD

### Typography
- **Headings**: Inter or system sans-serif, weight 700
- **Body**: Inter or system sans-serif, weight 400
- **Score badges**: Mono/bold, high contrast
- **Base size**: 16px

### Component Patterns
- **Game Cards**: Rounded (0.75rem), cover image top, info below, shadow glow on hover
- **Platform Badges**: Small pill-shaped badges with platform icon + name
- **Score Badges**: Circular or rounded-square, color-coded
- **Filter Buttons**: Toggle-style, active state with primary color
- **Calendar Grid**: Monthly view with release dates highlighted

---

## 5. Feature Specifications

### F01: Project Scaffold & Tailwind Setup
- Initialize project directory structure
- Include Tailwind CSS via CDN
- Set up base HTML with semantic structure
- Configure dark gaming theme with soft navy background
- Viewport meta, charset, lang attribute

### F02: RAWG API Integration
- Create API client module (`api.js`)
- Register for free RAWG API key
- Implement functions:
  - `fetchUpcomingGames(params)` - upcoming releases
  - `fetchGameDetails(id)` - individual game details
  - `fetchGenres()` - genre list
  - `fetchPlatforms()` - platform list
- Client-side caching (sessionStorage) to reduce API calls
- Error handling with user-friendly messages
- Loading skeleton states while fetching
- Rate limiting awareness (track calls)

### F03: Upcoming Releases Calendar/List View
- **List View** (default): Chronological list grouped by week
- **Calendar View** (toggle): Monthly grid with release dates marked
- Each date entry shows count of releases
- Click date to expand and show games releasing that day
- Smooth toggle animation between views
- Current date highlighted
- Infinite scroll or "Load More" for list view

### F04: Game Cards with Cover Art & Details
- Card layout:
  - Cover art image (lazy loaded, with fallback placeholder)
  - Game title (truncated if long)
  - Platform icons row (PC, PS5, Xbox, Switch)
  - Release date (formatted per locale)
  - Metacritic score badge (color-coded)
  - Genre tags (1-3 shown)
- Hover effect: subtle scale + shadow glow
- Click to expand: show full description, screenshots, links
- Responsive: 1 col mobile, 2 cols tablet, 3-4 cols desktop

### F05: Platform Filter
- Filter bar with toggle buttons:
  - All Platforms
  - PC (Windows)
  - PlayStation 5
  - Xbox Series X/S
  - Nintendo Switch
- Multi-select allowed (show games on ANY selected platform)
- Active filters visually highlighted
- Filter state persisted in URL params for shareability
- Instant re-fetch or client-side filter from cached data

### F06: Genre Filter
- Dropdown or expandable list of genres from RAWG API
- Common genres: Action, RPG, Adventure, Shooter, Strategy, Sports, Puzzle, Indie
- Multi-select with checkboxes
- "Clear Filters" button
- Combinable with platform filter
- Genre badges on cards match filter selections

### F07: This Month / Next Month Toggle
- Prominent toggle/tabs: "This Month" | "Next Month" | "Coming Soon (3+ months)"
- Auto-calculate date ranges based on current date
- "This Month" shows current month releases
- "Next Month" shows next month releases
- "Coming Soon" shows everything beyond next month
- Display month name and year in header

### F08: Metacritic Score Display & Sorting
- Score badge on each game card (circular, color-coded)
- Sort options: "Release Date", "Metacritic (High to Low)", "Metacritic (Low to High)", "Name A-Z"
- Sort dropdown in toolbar area
- Games without scores show "TBD" badge in gray
- Top-rated section: highlight games with 85+ score

### F09: Auto i18n (8+ Languages)
- Detect browser language via `navigator.language`
- Supported: EN, KO, JA, ZH, ES, DE, FR, PT
- Translate all UI strings (labels, buttons, messages, filter names)
- Date formatting per locale using `Intl.DateTimeFormat`
- Language switcher in header/footer
- Store preference in localStorage
- Fallback to EN

### F10: SEO Optimization
- Semantic HTML5 structure
- Meta title: "NextGen Game Radar - Upcoming Video Games & Metacritic Scores"
- Meta description with target keywords
- Open Graph tags with gaming-themed OG image
- Twitter Card tags
- JSON-LD structured data (WebSite, VideoGameSeries concepts)
- sitemap.xml, robots.txt
- Canonical URLs
- Proper heading hierarchy

### F11: Ad Integration
- **Adsterra (Primary)**:
  - Leaderboard banner (728x90) below header
  - Native ad between game sections
  - Sidebar ad on desktop (300x250)
  - Placeholder divs with `data-adsterra-key`
- **Google AdSense (Secondary)**:
  - Publisher ID: `ca-pub-7098271335538021`
  - Auto-ads script in head
  - Manual slot below game grid

### F12: Google Sheets Webhook
- Auto POST on user actions:
  - Page load (track referrer)
  - Filter change (platform/genre selected)
  - Game card click (game name)
- Payload: `{ timestamp, action, detail, language, referrer }`
- Silent, non-blocking fetch
- Debounced to prevent spam

### F13: Visitor Counter
- Footer display: "Today: X | Total: Y"
- localStorage-based with external counter backup
- Non-intrusive placement

### F14: Feedback & Social Sharing
- Feedback mailto: `taeshinkim11@gmail.com` with subject "NextGen Game Radar Feedback"
- Social sharing: Twitter/X, Facebook, Reddit, Copy Link
- Share individual game cards with pre-filled text
- "Share this month's releases" button

### F15: Static Pages
- About, FAQ/How to Use, Privacy Policy, Terms of Service
- Consistent dark theme across all pages
- Navigation back to main dashboard

---

## 6. Milestones & Git Strategy

### Milestone Plan

| Milestone | Features | Git Tag | Description |
|-----------|----------|---------|-------------|
| M1 | F01, F02 | v0.1.0 | Foundation + API integration |
| M2 | F03, F04 | v0.2.0 | Core views: calendar + cards |
| M3 | F05, F06, F07 | v0.3.0 | All filtering functionality |
| M4 | F08 | v0.4.0 | Metacritic scores + sorting |
| M5 | F09, F10 | v0.5.0 | SEO + i18n |
| M6 | F11, F12, F13 | v0.6.0 | Monetization + analytics |
| M7 | F14, F15 | v0.7.0 | Content pages + social |
| M8 | F16 | v1.0.0 | Production deployment |

### Git Strategy
```bash
gh repo create NextGenGameRadar --private --source=. --remote=origin
git init && git add . && git commit -m "feat(F01): initial scaffold"
git push -u origin main
# Tag at each milestone
git tag v0.1.0 && git push origin v0.1.0
```

---

## 7. Deployment Checklist

### Pre-Deployment
- [ ] All features implemented and tested
- [ ] RAWG API key configured (environment variable or config)
- [ ] Responsive design verified across breakpoints
- [ ] SEO tags validated
- [ ] Ad slots with placeholders
- [ ] Google Sheets webhook tested
- [ ] Visitor counter working
- [ ] i18n working for all 8 languages
- [ ] Static pages complete
- [ ] No console errors
- [ ] Lighthouse score > 90

### Vercel Deployment
```bash
vercel --prod
# Use Vercel URL publicly, hide GitHub username
```

### vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## 8. Google Sheets Webhook Setup

### Apps Script
```javascript
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
```

---

## 9. Ad Monetization Strategy

### Adsterra Placements
- Top banner (728x90 desktop / 320x50 mobile)
- In-feed native ad after every 8 game cards
- Sidebar (300x250) on desktop
- Footer banner

### Google AdSense
- Publisher ID: `ca-pub-7098271335538021`
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7098271335538021" crossorigin="anonymous"></script>
```

---

## 10. i18n Implementation

### Supported Languages
| Code | Language |
|------|----------|
| EN | English |
| KO | Korean |
| JA | Japanese |
| ZH | Chinese (Simplified) |
| ES | Spanish |
| DE | German |
| FR | French |
| PT | Portuguese |

### Translation Keys (Sample)
```json
{
  "EN": {
    "title": "NextGen Game Radar",
    "subtitle": "Upcoming Video Games & Metacritic Scores",
    "this_month": "This Month",
    "next_month": "Next Month",
    "coming_soon": "Coming Soon",
    "all_platforms": "All Platforms",
    "sort_by": "Sort By",
    "release_date": "Release Date",
    "score": "Score",
    "no_games": "No games found for this period.",
    "loading": "Loading games...",
    "tbd": "TBD"
  }
}
```

---

## 11. Performance & Accessibility

### Performance
- Image lazy loading for cover art
- sessionStorage caching for API responses (5 min TTL)
- Skeleton loading states
- Debounced filter changes
- Minimal JS bundle (vanilla, no framework)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard-navigable filter buttons and cards
- ARIA labels on platform icons and score badges
- Alt text on game cover images
- High contrast score badges
- Focus-visible outlines

---

## 12. API Rate Limiting Strategy

| Scenario | Approach |
|----------|----------|
| Initial page load | Fetch upcoming games (1 API call) |
| Filter change | Check cache first, fetch if miss (0-1 calls) |
| Month toggle | New fetch with date range (1 call) |
| Game detail expand | Fetch detail (1 call, cached) |
| Session total | ~5-10 calls per user session |
| Monthly budget | 20,000 calls = ~2,000 daily users safely |

---

## 13. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| RAWG API rate limit hit | Low | High | Aggressive caching, stale-while-revalidate |
| RAWG API deprecation | Very Low | Critical | Cache data locally, consider backup API |
| Missing cover art | Medium | Low | Fallback placeholder image |
| Metacritic scores missing | High | Low | Show "TBD" badge, sort unscored last |
| Slow image loading | Medium | Medium | Lazy loading, WebP if available, blur-up |

---

## 14. Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Daily Visitors | 100 | 1,000 |
| Page Views | 3,000 | 30,000 |
| Avg Session Duration | > 3 min | > 4 min |
| API Calls/Day | < 500 | < 2,000 |
| Ad Revenue | $1-10 | $20-100 |
| Google Indexation | Top 50 for target KW | Top 20 for target KW |

---

## 15. Future Enhancements (Post-MVP)

- Wishlist / reminder notifications (email or push)
- Price comparison across stores (Steam, PSN, Xbox Store)
- User reviews and ratings
- Trending games section
- Game comparison tool
- Twitch/YouTube live stream integration
- PWA with offline cached data
- Dark/light theme toggle

---

*Document Version: 1.0*
*Created: 2026-04-01*
*Methodology: Harness Design*
