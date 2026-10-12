// src/tests/expiry.test.ts - Unit tests for 24-hour auto-expiration and cleanup

import { describe, it, expect, beforeEach } from 'vitest';
import { isEventExpired24h, getTimeRemaining24h, EVENT_TTL_MS } from '../utils/status';
import { eventService } from '../services/eventService';

describe('24-Hour Expiration Utilities', () => {
  const baseTime = new Date('2026-10-13T12:00:00Z');

  it('declares an event active if created 2 hours ago', () => {
    const twoHoursAgo = new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString();
    expect(isEventExpired24h(twoHoursAgo, baseTime)).toBe(false);
  });

  it('declares an event active if created 23 hours 55 minutes ago', () => {
    const almostExpired = new Date(baseTime.getTime() - (23 * 60 + 55) * 60 * 1000).toISOString();
    expect(isEventExpired24h(almostExpired, baseTime)).toBe(false);
  });

  it('declares an event expired if created 24 hours ago', () => {
    const exactly24HoursAgo = new Date(baseTime.getTime() - 24 * 60 * 60 * 1000).toISOString();
    expect(isEventExpired24h(exactly24HoursAgo, baseTime)).toBe(true);
  });

  it('declares an event expired if created 25 hours ago', () => {
    const twentyFiveHoursAgo = new Date(baseTime.getTime() - 25 * 60 * 60 * 1000).toISOString();
    expect(isEventExpired24h(twentyFiveHoursAgo, baseTime)).toBe(true);
  });

  it('handles invalid or empty timestamps safely as expired', () => {
    expect(isEventExpired24h('', baseTime)).toBe(true);
    expect(isEventExpired24h('invalid-date', baseTime)).toBe(true);
  });

  it('calculates accurate remaining time for countdowns', () => {
    // 10 hours ago -> 14 hours remaining
    const tenHoursAgo = new Date(baseTime.getTime() - 10 * 60 * 60 * 1000).toISOString();
    const result = getTimeRemaining24h(tenHoursAgo, baseTime);
    expect(result.isExpired).toBe(false);
    expect(result.hoursLeft).toBe(14);
    expect(result.formatted).toBe('14h 0m left');
  });

  it('formats minutes left when under 1 hour remaining', () => {
    // 23 hours 15 minutes ago -> 45 minutes remaining
    const almostExpired = new Date(baseTime.getTime() - (23 * 60 + 15) * 60 * 1000).toISOString();
    const result = getTimeRemaining24h(almostExpired, baseTime);
    expect(result.isExpired).toBe(false);
    expect(result.hoursLeft).toBe(0);
    expect(result.minutesLeft).toBe(45);
    expect(result.formatted).toBe('45m left');
  });

  it('returns "Expired" when past 24 hours', () => {
    const past24h = new Date(baseTime.getTime() - 24.5 * 60 * 60 * 1000).toISOString();
    const result = getTimeRemaining24h(past24h, baseTime);
    expect(result.isExpired).toBe(true);
    expect(result.formatted).toBe('Expired');
  });
});

describe('eventService 24-hour Auto-Deletion', () => {
  beforeEach(() => {
    eventService.clearAllEvents();
  });

  it('submits an event with an expires_at timestamp 24 hours into the future', async () => {
    const beforeSubmit = Date.now();
    const event = await eventService.submitEvent({
      organizer_name: 'Shri Ram Mandal',
      address: 'Rajkamal Chowk, Amravati',
      image_url: 'data:image/jpeg;base64,mock',
    });

    expect(event.expires_at).toBeDefined();
    const expiresTime = new Date(event.expires_at!).getTime();
    expect(expiresTime).toBeGreaterThanOrEqual(beforeSubmit + EVENT_TTL_MS - 2000);
  });

  it('automatically purges events when cleanupExpiredEvents is executed after 24 hours', async () => {
    const event = await eventService.submitEvent({
      organizer_name: 'Navratri Seva Samiti',
      address: 'Gadge Nagar, Amravati',
      image_url: 'data:image/jpeg;base64,mock',
    });

    // Check it exists right now
    const initialEvents = await eventService.getApprovedEvents();
    expect(initialEvents.some((e) => e.id === event.id)).toBe(true);

    // Fast-forward reference clock 25 hours into the future
    const futureClock = new Date(Date.now() + 25 * 60 * 60 * 1000);
    const purged = eventService.cleanupExpiredEvents(futureClock);

    expect(purged).toBe(true);
    const remainingEvents = await eventService.getAllEvents();
    expect(remainingEvents.some((e) => e.id === event.id)).toBe(false);
  });

  it('preserves recent events while purging only those exceeding 24 hours', async () => {
    // Event 1 created "now"
    const freshEvent = await eventService.submitEvent({
      organizer_name: 'Fresh Mandal',
      address: 'Camp Road, Amravati',
      image_url: 'data:image/jpeg;base64,mock',
    });

    // Fast-forward 10 hours
    const clockAt10h = new Date(Date.now() + 10 * 60 * 60 * 1000);
    eventService.cleanupExpiredEvents(clockAt10h);

    const eventsAt10h = await eventService.getAllEvents();
    expect(eventsAt10h.some((e) => e.id === freshEvent.id)).toBe(true);

    // Fast-forward 25 hours from creation
    const clockAt25h = new Date(Date.now() + 25 * 60 * 60 * 1000);
    eventService.cleanupExpiredEvents(clockAt25h);

    const eventsAt25h = await eventService.getAllEvents();
    expect(eventsAt25h.some((e) => e.id === freshEvent.id)).toBe(false);
  });
});
