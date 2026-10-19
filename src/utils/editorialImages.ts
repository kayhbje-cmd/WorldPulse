import { CategoryId } from '../types/news';

// Curated high-resolution editorial photography from Unsplash
const EDITORIAL_IMAGE_BANK: Record<CategoryId, string[]> = {
  all: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80', // Global news desk
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', // Earth connectivity
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80', // Newspaper printing press
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80', // Editorial reading
  ],
  world: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80', // UN flags
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80', // Global map diplomacy
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80', // International summit
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80', // Global assembly
  ],
  india: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // India Gate New Delhi
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', // Indian architecture
    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80', // India cultural landscape
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80', // Indian tech corridor
  ],
  tech: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', // AI visual abstract
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', // Semiconductor chip
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80', // Cyber code & security
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80', // Robotics & innovation
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // Corporate skyscrapers
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', // Modern boardroom
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80', // Financial analysis
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80', // Global deal handshake
  ],
  finance: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80', // Stock trading screen
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80', // Market candlestick charts
    'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1200&q=80', // Gold bullion bar
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80', // Central bank building
  ],
  science: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', // Deep space nebula
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80', // Quantum physics / chemistry
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80', // Lab research
    'https://images.unsplash.com/photo-1517976487507-5b3bb11327e0?auto=format&fit=crop&w=1200&q=80', // Rocket launch
  ],
  sports: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80', // Stadium lights
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80', // Cricket / field sports
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80', // Football match
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80', // Racing / athletics
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80', // Cinema theatre
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80', // Concert performance
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80', // Red carpet & festival
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80', // Modern art gallery
  ],
  health: [
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80', // Medical stethoscope & diagnosis
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80', // Clinical healthcare
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80', // Medicine & pharmaceutical
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80', // Wellness & medical science
  ],
  politics: [
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80', // Capitol dome / Parliament
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80', // Diplomatic press conference
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80', // Governance chamber
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80', // Treaty document
  ],
};

// Keyword based image overrides
const KEYWORD_MAP: Array<{ regex: RegExp; url: string }> = [
  { regex: /\b(modi|delhi|mumbai|isro|bjp|congress|rupee|kashmir)\b/i, url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80' },
  { regex: /\b(ai|artificial intelligence|openai|gpt|nvidia|semiconductor|chip|anthropic)\b/i, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { regex: /\b(nasa|space|telescope|mars|moon|galaxy|james webb|astronomy)\b/i, url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  { regex: /\b(cricket|ipl|test match|kohli|bcci|world cup)\b/i, url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80' },
  { regex: /\b(football|soccer|champions league|premier league|messi|ronaldo)\b/i, url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80' },
  { regex: /\b(stock|stocks|wall street|nasdaq|dow|nifty|market|inflation|fed|rates)\b/i, url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' },
  { regex: /\b(pope|vatican|church|religion)\b/i, url: 'https://images.unsplash.com/photo-1548625361-195fe57871b6?auto=format&fit=crop&w=1200&q=80' },
  { regex: /\b(paris|france|macron|europe|germany|uk|london)\b/i, url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  { regex: /\b(climate|green|energy|solar|wind|carbon|arctic)\b/i, url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80' },
  { regex: /\b(cancer|virus|vaccine|hospital|doctor|surgery|medicine)\b/i, url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80' },
];

export function getEditorialImage(title: string = '', category: CategoryId = 'world', seedIndex: number = 0): string {
  // Check keyword match first
  for (const item of KEYWORD_MAP) {
    if (item.regex.test(title)) {
      return item.url;
    }
  }

  // Fall back to category bank with deterministic rotation based on string hash
  const bank = EDITORIAL_IMAGE_BANK[category] || EDITORIAL_IMAGE_BANK.world;
  let hash = seedIndex;
  for (let i = 0; i < title.length; i++) {
    hash = (hash + title.charCodeAt(i)) % bank.length;
  }
  return bank[Math.abs(hash) % bank.length];
}
