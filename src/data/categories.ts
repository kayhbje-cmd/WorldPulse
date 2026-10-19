import { Category } from '../types/news';

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'Top Stories',
    description: 'Curated global headlines and urgent briefings from international news wires.',
    iconName: 'Flame',
  },
  {
    id: 'world',
    name: 'World',
    description: 'Geopolitics, international diplomacy, regional affairs, and global summits.',
    iconName: 'Globe2',
  },
  {
    id: 'india',
    name: 'India',
    description: 'National affairs, economic trajectory, infrastructure, state policy, and culture.',
    iconName: 'Compass',
  },
  {
    id: 'tech',
    name: 'Technology',
    description: 'Artificial intelligence, quantum computing, semiconductors, and digital privacy.',
    iconName: 'Cpu',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Global commerce, enterprise leadership, corporate mergers, and supply chains.',
    iconName: 'Building2',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Central banks, stock exchanges, interest rates, commodities, and currency markets.',
    iconName: 'TrendingUp',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Astrophysics, space exploration, biomedical discoveries, and climate research.',
    iconName: 'Atom',
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Cricket, football, Formula 1, championship tournaments, and athletic achievements.',
    iconName: 'Trophy',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Cinema, global culture, literature, the arts, architecture, and festivals.',
    iconName: 'Film',
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Medical breakthroughs, public health, longevity research, and medical ethics.',
    iconName: 'HeartPulse',
  },
  {
    id: 'politics',
    name: 'Politics',
    description: 'Elections, legislative shifts, policy doctrines, and democratic institutions.',
    iconName: 'Landmark',
  },
];
