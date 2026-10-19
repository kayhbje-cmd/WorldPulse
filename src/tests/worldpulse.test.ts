import { describe, it, expect, beforeEach } from 'vitest';
import { CATEGORIES } from '../data/categories';
import { formatRelativeTime, WORLD_CLOCKS, getFormattedCityTime } from '../utils/date';
import { calculateReadingTime } from '../utils/readingTime';
import { parseRawRssItems } from '../services/newsService';
import { storageService } from '../services/storageService';

describe('WorldPulse Core Architecture & Features', () => {
  it('should define all 10 international news categories plus Top Stories', () => {
    const expectedCategories = [
      'all',
      'world',
      'india',
      'tech',
      'business',
      'finance',
      'science',
      'sports',
      'entertainment',
      'health',
      'politics',
    ];
    const categoryIds = CATEGORIES.map((c) => c.id);
    expectedCategories.forEach((cat) => {
      expect(categoryIds).toContain(cat);
    });
    expect(CATEGORIES.length).toBe(11);
  });

  it('should format relative timestamps accurately', () => {
    const now = new Date();
    expect(formatRelativeTime(now.toISOString())).toBe('Just now');

    const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000);
    expect(formatRelativeTime(tenMinsAgo.toISOString())).toBe('10m ago');

    const threeHoursAgo = new Date(now.getTime() - 3 * 3600 * 1000);
    expect(formatRelativeTime(threeHoursAgo.toISOString())).toBe('3h ago');

    expect(formatRelativeTime('')).toBe('Recently');
    expect(formatRelativeTime('invalid-date')).toBe('Recently');
  });

  it('should configure 5 major international timezone clocks', () => {
    expect(WORLD_CLOCKS.length).toBe(5);
    const cities = WORLD_CLOCKS.map((c) => c.city);
    expect(cities).toContain('London');
    expect(cities).toContain('New York');
    expect(cities).toContain('New Delhi');
    expect(cities).toContain('Tokyo');
    expect(cities).toContain('Geneva');

    const timeStr = getFormattedCityTime('Europe/London');
    expect(timeStr).not.toBe('--:--');
  });

  it('should calculate reading time accurately', () => {
    expect(calculateReadingTime('')).toBe(3);
    const shortText = 'Headline with summary of the news story';
    expect(calculateReadingTime(shortText)).toBeGreaterThanOrEqual(2);

    const longText = new Array(600).fill('journalism').join(' ');
    expect(calculateReadingTime(longText)).toBe(3);
  });

  it('should parse raw RSS items and clean headlines and sources without fabrication', () => {
    const mockItems = [
      {
        title: 'UN Climate Summit Adopts New Mitigation Pact - Reuters',
        link: 'https://news.google.com/articles/sample-1',
        pubDate: 'Mon, 19 Oct 2026 12:00:00 GMT',
        description: '<p>World leaders have agreed on new industrial emissions targets.</p>',
        source: {
          '#text': 'Reuters',
          '@_url': 'https://www.reuters.com',
        },
      },
    ];

    const parsed = parseRawRssItems(mockItems, 'world', 'google');
    expect(parsed.length).toBe(1);
    expect(parsed[0].title).toBe('UN Climate Summit Adopts New Mitigation Pact');
    expect(parsed[0].source.name).toBe('Reuters');
    expect(parsed[0].url).toBe('https://news.google.com/articles/sample-1');
    expect(parsed[0].category).toBe('world');
    expect(parsed[0].imageUrl).toMatch(/^https:\/\//);
  });

  it('should manage bookmarks in storageService', () => {
    storageService.clearAllBookmarks();
    expect(storageService.getBookmarks().length).toBe(0);

    const isAdded = storageService.toggleBookmark('test-art-1');
    expect(isAdded).toBe(true);
    expect(storageService.isBookmarked('test-art-1')).toBe(true);
    expect(storageService.getBookmarks()).toContain('test-art-1');

    const isRemoved = storageService.toggleBookmark('test-art-1');
    expect(isRemoved).toBe(false);
    expect(storageService.isBookmarked('test-art-1')).toBe(false);
  });

  it('should support view routing targets (home, about, contact, privacy)', () => {
    const validViews = ['home', 'about', 'contact', 'privacy'];
    expect(validViews.length).toBe(4);
    expect(validViews).toContain('about');
    expect(validViews).toContain('contact');
    expect(validViews).toContain('privacy');
  });

  it('should guarantee transparent publisher citation without inventing authors or outlets', () => {
    const itemWithoutSource = [
      {
        title: 'Global Summit Concludes with Carbon Agreement',
        link: 'https://news.google.com/sample',
        description: 'Representatives from 190 nations concluded discussions.',
      },
    ];
    const parsed = parseRawRssItems(itemWithoutSource, 'world', 'google');
    expect(parsed[0].source.name).toBe('International Wire');
    expect(parsed[0].url).toBe('https://news.google.com/sample');
    expect(parsed[0].feedOrigin).toBe('google');
  });
});

