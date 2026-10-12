// src/utils/status.ts - Real-time status calculation and formatting

import { BhandaraEvent, ComputedLiveStatus, EventCategory, EventStatus } from '../types';

/**
 * Calculates live event status based on event date, start/end time, and admin status.
 * @param event Event object containing event_date, start_time, end_time, and status
 * @param referenceDate Optional date for deterministic testing / current clock
 */
export function getEventLiveStatus(
  event: Pick<BhandaraEvent, 'event_date' | 'start_time' | 'end_time' | 'status'>,
  referenceDate: Date = new Date()
): ComputedLiveStatus {
  if (event.status === 'cancelled') {
    return 'cancelled';
  }

  try {
    // Current date components in local time
    const refYear = referenceDate.getFullYear();
    const refMonth = referenceDate.getMonth();
    const refDay = referenceDate.getDate();

    // Parse event date
    const [eYear, eMonth, eDay] = event.event_date.split('-').map(Number);
    if (!eYear || !eMonth || !eDay) return 'upcoming';

    // Parse start and end times
    const [startH, startM] = (event.start_time || '00:00').split(':').map(Number);
    const [endH, endM] = (event.end_time || '23:59').split(':').map(Number);

    const eventStartDate = new Date(eYear, eMonth - 1, eDay, startH || 0, startM || 0, 0);
    const eventEndDate = new Date(eYear, eMonth - 1, eDay, endH || 23, endM || 59, 59);

    // Same day comparison
    const isToday = refYear === eYear && refMonth === eMonth - 1 && refDay === eDay;

    if (isToday) {
      const nowTime = referenceDate.getTime();
      if (nowTime < eventStartDate.getTime()) {
        return 'upcoming';
      } else if (nowTime <= eventEndDate.getTime()) {
        return 'currently_serving';
      } else {
        return 'completed';
      }
    }

    // Future date check
    const todayMidnight = new Date(refYear, refMonth, refDay, 0, 0, 0).getTime();
    const eventMidnight = new Date(eYear, eMonth - 1, eDay, 0, 0, 0).getTime();

    if (eventMidnight > todayMidnight) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  } catch {
    return 'upcoming';
  }
}

/**
 * Visual styling and metadata for each computed live status
 */
export function getStatusBadge(status: ComputedLiveStatus) {
  switch (status) {
    case 'currently_serving':
      return {
        label: 'Currently Serving',
        marathiLabel: 'प्रसाद सुरू आहे',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        pulse: true,
      };
    case 'upcoming':
      return {
        label: 'Upcoming',
        marathiLabel: 'आगामी',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        pulse: false,
      };
    case 'completed':
      return {
        label: 'Completed',
        marathiLabel: 'समाप्त',
        bg: 'bg-stone-100',
        text: 'text-stone-600',
        border: 'border-stone-200',
        dot: 'bg-stone-400',
        pulse: false,
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        marathiLabel: 'रद्द',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
        pulse: false,
      };
  }
}

/**
 * Category metadata and color scheme
 */
export function getCategoryDetails(category: EventCategory) {
  switch (category) {
    case 'bhandara':
      return {
        label: 'Bhandara',
        marathiLabel: 'भंडारा',
        description: 'Sacred Community Feast',
        bg: 'bg-orange-100',
        text: 'text-orange-900',
        border: 'border-orange-200',
      };
    case 'mahaprasad':
      return {
        label: 'Mahaprasad',
        marathiLabel: 'महाप्रसाद',
        description: 'Sanctified Temple Offering',
        bg: 'bg-amber-100',
        text: 'text-amber-900',
        border: 'border-amber-200',
      };
    case 'annadan':
      return {
        label: 'Annadan Seva',
        marathiLabel: 'अन्नदान सेवा',
        description: 'Charitable Meal Distribution',
        bg: 'bg-red-100',
        text: 'text-red-900',
        border: 'border-red-200',
      };
    case 'temple_feast':
      return {
        label: 'Temple Feast',
        marathiLabel: 'मंदिर महाप्रसाद',
        description: 'Temple Utsav Bhojan',
        bg: 'bg-yellow-100',
        text: 'text-yellow-900',
        border: 'border-yellow-200',
      };
    case 'community_meals':
      return {
        label: 'Community Meals (J1)',
        marathiLabel: 'सामुदायिक जेवण (J1)',
        description: 'Community Gathering Meal',
        bg: 'bg-orange-50',
        text: 'text-orange-800',
        border: 'border-orange-200',
      };
  }
}

/**
 * Format 24-hr time '14:30' into '2:30 PM'
 */
export function formatTime12H(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 hour is 12 AM
  return `${h}:${m} ${ampm}`;
}

/**
 * Formats time range e.g. "12:00 PM – 4:00 PM"
 */
export function formatTimeRange(start: string, end: string): string {
  return `${formatTime12H(start)} – ${formatTime12H(end)}`;
}

/**
 * Formats event date string into human readable format, e.g. "Tuesday, 14 Oct 2026"
 */
export function formatEventDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
