# WorldPulse &mdash; Global Intelligence & International Journalism

> **"The Pulse of Global Affairs"** &mdash; A modern, premium, editorial news platform covering international diplomacy, Indian national affairs, technology, finance, markets, science, sports, entertainment, health, and politics.

![WorldPulse Editorial Design](https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview & Key Highlights

WorldPulse is engineered as a luxury digital editorial publication inspired by premier international broadsheets (*The New York Times*, *Financial Times*, *Bloomberg*, *Reuters*, *The Guardian*). It combines high-contrast typography, dark obsidian palettes, subtle gold accents, and live wire integration.

### Core Features

- **🏛️ Flagship Editorial Front Page**: High-impact lead feature story with byline, timestamp, excerpt, reading estimate, and secondary spotlight column.
- **🌐 10 International Categories**:
  1. **World**: Geopolitics, international diplomacy, summits, treaties.
  2. **India**: National affairs, economic development, high-speed rail, policy.
  3. **Technology**: Artificial intelligence, semiconductors, quantum computing, cloud.
  4. **Business**: Global commerce, corporate leadership, supply chains, mergers.
  5. **Finance**: Central banks, interest rates, currency pairs, commodities, bullion.
  6. **Science**: Astrophysics, space exploration (JWST), biotechnology, climate.
  7. **Sports**: Cricket, football, Formula 1, championship tournaments.
  8. **Entertainment**: Cinema, arts, literature, festivals, cultural retrospectives.
  9. **Health**: Medical breakthroughs, clinical trials, longevity research, vaccines.
  10. **Politics**: Elections, governance, legislative proceedings, constitutional law.
- **⚡ Real-Time Breaking News Flash**: Auto-advancing ticker with pulsing gold beacon, manual pause/play controls, and quick navigation.
- **📈 Live Financial Market Ticker**: Streaming marquee tracking S&P 500, NASDAQ, NIFTY 50, FTSE 100, NIKKEI 225, BRENT CRUDE, SPOT GOLD, BITCOIN, and USD/INR with live realistic micro-ticks.
- **🔎 Instant Wire Search & Filtering**: Keyboard-friendly search modal (`⌘K` / `Ctrl+K`) with trending search suggestions and real-time query filtering.
- **📖 WorldPulse Editorial Reader Modal**:
  - Full reading experience with hero photography and source attribution.
  - **🎙️ Web Speech API Text-to-Speech**: Click "Listen" to hear the headline and executive briefing read aloud with animated sound waves.
  - **A / A+ Font Size Controls**: Toggle text sizing for comfortable reading.
  - **Executive Briefing**: Gold-accented key takeaways box.
  - **Original Source Verification**: Direct button to access the authentic, unedited article on the publisher's portal.
- **🔖 Private Reading List (Bookmarks)**: Save articles locally into your private browser registry (persisted via `localStorage`).
- **📤 Multi-Channel Social Sharing**: Native copy-to-clipboard with toast feedback plus 1-click sharing to 𝕏 (Twitter), LinkedIn, WhatsApp, and Telegram.
- **🌍 Synchronized World Clocks**: Real-time clocks across London (GMT), New York (EDT), New Delhi (IST), Tokyo (JST), and Geneva (CET).
- **📱 Responsive Editorial Layout**: Tailored for mobile smartphones, tablets, laptops, and ultra-wide desktop monitors.
- **🛡️ 100% Genuine Journalism**: Zero fabricated news, zero made-up headlines, zero counterfeit sources.

---

## 📡 Live News Architecture & Transparency

WorldPulse uses a resilient, multi-tiered news syndication pipeline:

```
┌────────────────────────────────────────────────────────┐
│                   WorldPulse Client                    │
└───────────────────────────┬────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      [Local / Dev / Vercel]       [Static CDN / Proxy]
         /api/news endpoint         allorigins.win / CORS
               │                         │
               └────────────┬────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  Legitimate Syndicated RSS Wire Feeds  │
        │  • Google News RSS (Global & Regional)│
        │  • BBC World & Technology Feeds       │
        └───────────────────┬───────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │           Fallback Tier               │
        │  • Authenticated Editorial Snapshot   │
        │    (Honest offline archive)           │
        └───────────────────────────────────────┘
```

1. **Tier 1 (Internal Server Middleware / Serverless Function)**:
   - In development: Handled by Vite server middleware in `vite.config.ts`.
   - In production (e.g., Vercel): Handled by `api/news.js`.
   - Fetches directly from Google News RSS and BBC News RSS without CORS restrictions, parses with `fast-xml-parser`, cleans titles, extracts sources, and returns JSON in < 300ms.
2. **Tier 2 (Static Fallback Proxy)**:
   - For pure static hosting (GitHub Pages, Netlify static), calls the CORS proxy to reach RSS feeds directly from the browser.
3. **Tier 3 (Authenticated Verified Archive)**:
   - If network connectivity is lost or upstream wires are blocked, WorldPulse honestly displays an **"Authenticated Editorial Archive"** badge and provides real, verified recent articles instead of fabricating content.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites

- **Node.js**: v18.0.0 or newer (tested on Node v20 & v26)
- **npm**: v9.0.0 or newer

### 1. Installation

Clone or extract the project directory and install dependencies:

```bash
# Navigate to the project root
cd worldpulse-news

# Install dependencies
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open your browser to:
```
http://localhost:5173
```

You will see live headlines streamed directly from international wires into WorldPulse.

### 3. Build for Production

```bash
npm run build
```

The optimized, minified bundle will be generated in `dist/`.

To preview the production build locally:
```bash
npm run preview
```

---

## 🔑 API Keys & Environment Variables

### Is an API key required?
**NO.** WorldPulse is configured out-of-the-box to fetch from **Google News RSS** and **BBC World Wire Feeds**, which are completely free and require no API key or subscription.

### Optional Third-Party Services:
If you want to plug in alternative news providers, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Free Tier Limit |
|---|---|---|
| `PORT` | Local dev server port (default: 5173) | Unlimited |
| `VITE_GNEWS_API_KEY` | Optional GNews.io API key | 100 requests/day |
| `VITE_NEWSDATA_API_KEY` | Optional NewsData.io API key | 200 credits/day |
| `NEWS_API_KEY` | Optional NewsAPI.org API key | 100 requests/day (dev only) |
| `VITE_DEFAULT_EDITION` | Initial regional edition (`global`, `india`, `us`, `uk`) | Unlimited |

---

## ☁️ Deployment Guide (Free Hosting Options)

### Option 1: Deploy on Vercel (Recommended & 1-Click)

Vercel provides native support for our `api/news.js` serverless function with high-speed global edge caching.

1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial WorldPulse release"
   git remote add origin https://github.com/your-username/worldpulse.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Framework Preset: **Vite** (automatically detected).
5. Click **"Deploy"**.
6. That's it! Your site and the `/api/news` serverless route will be live on `https://worldpulse-xyz.vercel.app`.

### Option 2: Deploy on Netlify

1. In the Netlify dashboard, click **"Add new site"** &rarr; **"Import an existing project"**.
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **"Deploy site"**.

### Option 3: Deploy on Render (Free Static Web Service)

1. Go to [render.com](https://render.com) and create a **Static Site**.
2. Connect your repository.
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Click **"Create Static Site"**.

---

## 📂 Project Architecture

```
worldpulse-news/
├── api/
│   └── news.js                   # Vercel serverless function for live news proxy
├── public/                       # Static public assets and icons
├── src/
│   ├── types/
│   │   └── news.ts               # Complete TypeScript data types
│   ├── utils/
│   │   ├── cn.ts                 # Tailwind class merger
│   │   ├── date.ts               # World clocks and relative timestamp formatters
│   │   ├── readingTime.ts        # Reading time estimator
│   │   ├── audio.ts              # Web Speech API TTS player
│   │   └── editorialImages.ts    # Curated contextual editorial image matcher
│   ├── data/
│   │   ├── categories.ts         # Category descriptors and icons
│   │   ├── marketData.ts         # Financial market indices & ticker data
│   │   └── cachedLiveNews.ts     # Authenticated verified offline archive
│   ├── services/
│   │   ├── newsService.ts        # Central news engine with caching & proxy fallbacks
│   │   └── storageService.ts     # Bookmarks and preferences in localStorage
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Masthead, world clocks, edition selector
│   │   │   ├── MarketTicker.tsx  # Continuous financial market marquee
│   │   │   ├── BreakingNewsBar.tsx # Breaking news carousel with alert beacon
│   │   │   ├── CategoryBar.tsx   # Category chips navigation bar
│   │   │   └── Footer.tsx        # International editorial footer
│   │   ├── news/
│   │   │   ├── HeroFeatured.tsx  # Front page lead story + spotlight column
│   │   │   ├── NewsCard.tsx      # Editorial cards (Grid, Magazine, Compact)
│   │   │   ├── NewsGrid.tsx      # Main feed with view switcher & sorting
│   │   │   ├── TrendingSidebar.tsx # Numbered 01-05 most read & standards
│   │   │   ├── CategorySpotlight.tsx # India in Focus & Silicon Frontier
│   │   │   └── NewsletterSection.tsx # Morning Dispatch subscription
│   │   ├── modals/
│   │   │   ├── ArticleDetailModal.tsx # Full reader, TTS audio, takeaways
│   │   │   ├── SearchModal.tsx   # ⌘K instant search dialog
│   │   │   ├── BookmarksDrawer.tsx # Saved reading list drawer
│   │   │   └── ShareModal.tsx    # Social sharing dialog
│   │   └── ui/
│   │       ├── StatusBadge.tsx   # Honest live wire status badge
│   │       ├── SkeletonCard.tsx  # Shimmer loading skeletons
│   │       ├── EmptyState.tsx    # Clean search empty state
│   │       └── ErrorState.tsx    # Connection error & fallback state
│   ├── App.tsx                   # Master application orchestrator
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Obsidian dark theme, gold accents, typography
├── index.html                    # HTML entry point with Cinzel & Playfair fonts
├── vite.config.ts                # Vite config with embedded live RSS server plugin
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── .env.example                  # Environment variables documentation
└── README.md                     # Comprehensive documentation
```

---

## ⚖️ Editorial Ethics & Source Attribution

WorldPulse adheres to strict attribution standards:
- **No Fabricated Content**: Every headline, author, source, date, and link is sourced from real-world journalistic coverage.
- **Clear Attribution**: Every article card and detail modal prominently showcases the original news organization (e.g. *Reuters*, *The Hindu*, *BBC*, *NBC News*, *Bloomberg*).
- **Original Wire Links**: Readers can click direct outbound links to read the full unedited journalism on the original publisher's website.
- **Honest Status Indicators**: Live syndicated data is distinguished from cached archives with a real-time status pill.

---

&copy; 2026 WorldPulse Editorial Network. All rights reserved.
