// src/tests/status.test.ts - Unit tests for dynamic event status and time utilities

import { describe, it, expect } from 'vitest';
import { getEventLiveStatus, formatTime12H, formatTimeRange } from '../utils/status';

describe('getEventLiveStatus', () => {
  it('returns "cancelled" if event status is cancelled regardless of time', () => {
    const status = getEventLiveStatus(
      {
        event_date: '2026-10-15',
        start_time: '12:00',
        end_time: '16:00',
        status: 'cancelled',
      },
      new Date('2026-10-15T13:00:00')
    );
    expect(status).toBe('cancelled');
  });

  it('returns "currently_serving" when today and clock is between start and end time', () => {
    const testNow = new Date(2026, 9, 15, 13, 30, 0); // 15 Oct 2026, 1:30 PM
    const status = getEventLiveStatus(
      {
        event_date: '2026-10-15',
        start_time: '12:00',
        end_time: '16:00',
        status: 'approved',
      },
      testNow
    );
    expect(status).toBe('currently_serving');
  });

  it('returns "upcoming" when today but clock is before start time', () => {
    const testNow = new Date(2026, 9, 15, 10, 0, 0); // 15 Oct 2026, 10:00 AM
    const status = getEventLiveStatus(
      {
        event_date: '2026-10-15',
        start_time: '12:00',
        end_time: '16:00',
        status: 'approved',
      },
      testNow
    );
    expect(status).toBe('upcoming');
  });

  it('returns "completed" when today but clock is past end time', () => {
    const testNow = new Date(2026, 9, 15, 17, 30, 0); // 15 Oct 2026, 5:30 PM
    const status = getEventLiveStatus(
      {
        event_date: '2026-10-15',
        start_time: '12:00',
        end_time: '16:00',
        status: 'approved',
      },
      testNow
    );
    expect(status).toBe('completed');
  });

  it('returns "upcoming" for future event dates', () => {
    const testNow = new Date(2026, 9, 10, 12, 0, 0); // 10 Oct 2026
    const status = getEventLiveStatus(
      {
        event_date: '2026-10-18',
        start_time: '12:00',
        end_time: '16:00',
        status: 'approved',
      },
      testNow
    );
    expect(status).toBe('upcoming');
  });

  it('returns "completed" for past event dates', () => {
    const testNow = new Date(2026, 9, 20, 12, 0, 0); // 20 Oct 2026
    const status = getEventLiveStatus(
      {
        event_date: '2026-10-10',
        start_time: '12:00',
        end_time: '16:00',
        status: 'approved',
      },
      testNow
    );
    expect(status).toBe('completed');
  });
});

describe('Time formatting utilities', () => {
  it('formats 24-hr times into 12-hr AM/PM', () => {
    expect(formatTime12H('12:00')).toBe('12:00 PM');
    expect(formatTime12H('16:30')).toBe('4:30 PM');
    expect(formatTime12H('09:15')).toBe('9:15 AM');
    expect(formatTime12H('00:00')).toBe('12:00 AM');
  });

  it('formats time ranges', () => {
    expect(formatTimeRange('11:30', '15:00')).toBe('11:30 AM – 3:00 PM');
  });
});
