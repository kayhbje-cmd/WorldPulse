import { XMLParser } from 'fast-xml-parser';

const CATEGORY_IMAGE_MAP = {
  world: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
  ],
  india: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
  ],
  tech: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
  ],
  finance: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1200&q=80',
  ],
  science: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
  ],
  sports: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
  ],
  health: [
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
  ],
  politics: [
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  ],
  all: [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  ],
};

function resolveArticleImage(item, title, category, index) {
  if (item['media:thumbnail'] && item['media:thumbnail']['@_url']) {
    return item['media:thumbnail']['@_url'];
  }
  if (item['media:content'] && item['media:content']['@_url']) {
    return item['media:content']['@_url'];
  }
  if (item.enclosure && item.enclosure['@_url']) {
    return item.enclosure['@_url'];
  }

  const lower = title.toLowerCase();
  if (/(modi|delhi|mumbai|isro|bjp|congress|rupee|kashmir)/.test(lower)) {
    return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80';
  }
  if (/(ai|artificial intelligence|openai|gpt|nvidia|semiconductor|chip|anthropic)/.test(lower)) {
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  }
  if (/(nasa|space|telescope|mars|moon|galaxy|james webb|astronomy)/.test(lower)) {
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
  }
  if (/(cricket|ipl|test match|kohli|bcci|world cup)/.test(lower)) {
    return 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80';
  }
  if (/(football|soccer|champions league|premier league|messi|ronaldo)/.test(lower)) {
    return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80';
  }
  if (/(stock|stocks|wall street|nasdaq|dow|nifty|market|inflation|fed|rates)/.test(lower)) {
    return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80';
  }
  if (/(cancer|virus|vaccine|hospital|doctor|surgery|medicine)/.test(lower)) {
    return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80';
  }

  const bank = CATEGORY_IMAGE_MAP[category] || CATEGORY_IMAGE_MAP.all;
  return bank[index % bank.length];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category = 'all', q = '', edition = 'global' } = req.query || {};
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

  let rssUrl = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en';
  const langCode = edition === 'india' ? 'hl=en-IN&gl=IN&ceid=IN:en' : 'hl=en-US&gl=US&ceid=US:en';

  if (q && q.trim()) {
    rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
  } else {
    switch (category) {
      case 'all':
        rssUrl = `https://news.google.com/rss?${langCode}`;
        break;
      case 'world':
        rssUrl = `https://news.google.com/rss/headlines/section/topic/WORLD?${langCode}`;
        break;
      case 'india':
        rssUrl = `https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en`;
        break;
      case 'tech':
        rssUrl = `https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?${langCode}`;
        break;
      case 'business':
        rssUrl = `https://news.google.com/rss/headlines/section/topic/BUSINESS?${langCode}`;
        break;
      case 'finance':
        rssUrl = `https://news.google.com/rss/search?q=stocks+markets+economy+inflation+banks&${langCode}`;
        break;
      case 'science':
        rssUrl = `https://news.google.com/rss/headlines/section/topic/SCIENCE?${langCode}`;
        break;
      case 'sports':
        rssUrl = `https://news.google.com/rss/headlines/section/topic/SPORTS?${langCode}`;
        break;
      case 'entertainment':
        rssUrl = `https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?${langCode}`;
        break;
      case 'health':
        rssUrl = `https://news.google.com/rss/headlines/section/topic/HEALTH?${langCode}`;
        break;
      case 'politics':
        rssUrl = `https://news.google.com/rss/search?q=geopolitics+election+parliament+diplomacy&${langCode}`;
        break;
      default:
        rssUrl = `https://news.google.com/rss?${langCode}`;
    }
  }

  try {
    const upstream = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'WorldPulse/1.0 (Vercel Serverless News Engine)',
      },
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'Failed to fetch upstream RSS' });
    }

    const xml = await upstream.text();
    const parsed = parser.parse(xml);
    const rawItems = parsed.rss?.channel?.item || [];
    const itemsList = Array.isArray(rawItems) ? rawItems : [rawItems];

    const articles = itemsList.slice(0, 40).map((item, idx) => {
      const rawTitle = String(item.title || '');
      let sourceName = '';
      let sourceUrl = '';

      if (item.source) {
        if (typeof item.source === 'string') {
          sourceName = item.source;
        } else if (typeof item.source === 'object') {
          sourceName = item.source['#text'] || '';
          sourceUrl = item.source['@_url'] || '';
        }
      }

      let cleanTitle = rawTitle;
      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ');
        const candidate = parts[parts.length - 1].trim();
        if (!sourceName && candidate.length > 0 && candidate.length < 35) {
          sourceName = candidate;
        }
        cleanTitle = parts.slice(0, -1).join(' - ').trim();
      }

      if (!sourceName) sourceName = 'International Wire';

      let excerpt = '';
      if (item.description) {
        excerpt = String(item.description)
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ')
          .trim();
        if (excerpt.length > 250) excerpt = excerpt.slice(0, 240) + '...';
      }

      if (!excerpt || excerpt.length < 20) {
        excerpt = `${sourceName} reported on international developments: ${cleanTitle}. Read verified news wire report for details.`;
      }

      const imageUrl = resolveArticleImage(item, cleanTitle, category, idx);

      return {
        id: `vcl-${category}-${idx}-${Date.now().toString(36)}`,
        title: cleanTitle,
        description: excerpt,
        content: excerpt,
        url: item.link || '#',
        source: {
          name: sourceName,
          url: sourceUrl || undefined,
        },
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        imageUrl,
        category,
        readingTime: 4,
        isBreaking: idx === 0,
        isTrending: idx < 4,
        isFeatured: idx === 0,
        feedOrigin: 'google',
      };
    });

    return res.status(200).json({ status: 'success', category, count: articles.length, articles });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error processing news' });
  }
}
