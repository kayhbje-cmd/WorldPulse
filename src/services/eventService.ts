// src/services/eventService.ts - 100% Client-Side Local Storage Service (Zero Mock Data, 24h Auto-Deletion)

import { BhandaraEvent, EventReport, EventStatus } from '../types';
import { EventReportFormData, EventSubmissionFormData } from '../utils/validation';
import { EVENT_TTL_MS, isEventExpired24h } from '../utils/status';

// Clean storage key ensuring no legacy mock data is loaded
const STORAGE_KEY_EVENTS = 'bhandara_live_events_clean';
const STORAGE_KEY_REPORTS = 'bhandara_live_reports_clean';

class EventService {
  private eventsCache: BhandaraEvent[] = [];
  private reportsCache: EventReport[] = [];
  private listeners: Set<() => void> = new Set();
  private cleanupInterval: any = null;

  constructor() {
    this.initLocalData();
    this.startAutoCleanupTimer();
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  /**
   * Starts periodic 60-second cleanup timer to purge events reaching 24 hours
   */
  private startAutoCleanupTimer() {
    if (typeof window !== 'undefined' && !this.cleanupInterval) {
      this.cleanupInterval = setInterval(() => {
        this.cleanupExpiredEvents();
      }, 60 * 1000);
    }
  }

  /**
   * Automatically deletes any uploaded event older than 24 hours.
   * Returns true if any expired events were purged.
   */
  public cleanupExpiredEvents(referenceDate: Date = new Date()): boolean {
    const initialCount = this.eventsCache.length;
    const activeEvents = this.eventsCache.filter((e) => !isEventExpired24h(e.created_at, referenceDate));

    if (activeEvents.length !== initialCount) {
      this.eventsCache = activeEvents;
      try {
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(activeEvents));
      } catch (e) {
        console.warn('LocalStorage save failed during expiry cleanup:', e);
      }

      // Also clean up any orphan reports belonging to purged events
      const activeIds = new Set(activeEvents.map((e) => e.id));
      const activeReports = this.reportsCache.filter((r) => activeIds.has(r.event_id));
      if (activeReports.length !== this.reportsCache.length) {
        this.reportsCache = activeReports;
        try {
          localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(activeReports));
        } catch (e) {
          console.warn('LocalStorage report cleanup save failed:', e);
        }
      }

      this.notify();
      return true;
    }
    return false;
  }

  private initLocalData() {
    try {
      // Clear any legacy mock data from old keys
      localStorage.removeItem('bhandara_events_v1');
      localStorage.removeItem('bhandara_reports_v1');

      const storedEvents = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (storedEvents) {
        const parsed = JSON.parse(storedEvents);
        // Ensure no leftover demo items exist
        this.eventsCache = Array.isArray(parsed) ? parsed.filter((e) => !e.is_demo) : [];
      } else {
        // Absolutely zero mock data - starts clean
        this.eventsCache = [];
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify([]));
      }

      const storedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (storedReports) {
        this.reportsCache = JSON.parse(storedReports);
      } else {
        this.reportsCache = [];
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify([]));
      }

      // Immediately purge any events that reached 24 hours while page was closed
      this.cleanupExpiredEvents();
    } catch {
      this.eventsCache = [];
      this.reportsCache = [];
    }
  }

  private saveEventsToLocal(events: BhandaraEvent[]) {
    this.eventsCache = events;
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    this.notify();
  }

  private saveReportsToLocal(reports: EventReport[]) {
    this.reportsCache = reports;
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    this.notify();
  }

  /**
   * Fetch all live active events for public view (automatically cleans 24h expired events)
   */
  public async getApprovedEvents(): Promise<BhandaraEvent[]> {
    this.cleanupExpiredEvents();
    return this.eventsCache.filter((e) => e.status === 'approved' || e.status === 'completed');
  }

  /**
   * Fetch all events (automatically cleans 24h expired events)
   */
  public async getAllEvents(): Promise<BhandaraEvent[]> {
    this.cleanupExpiredEvents();
    return [...this.eventsCache];
  }

  /**
   * Admin / Manager helper
   */
  public async getAllEventsForAdmin(): Promise<BhandaraEvent[]> {
    return this.getAllEvents();
  }

  /**
   * Pending events helper
   */
  public async getPendingEvents(): Promise<BhandaraEvent[]> {
    this.cleanupExpiredEvents();
    return this.eventsCache.filter((e) => e.status === 'pending');
  }

  /**
   * Fetch single event by ID (returns null if 24h expired)
   */
  public async getEventById(id: string): Promise<BhandaraEvent | null> {
    this.cleanupExpiredEvents();
    return this.eventsCache.find((e) => e.id === id) || null;
  }

  /**
   * Anyone can submit/upload a Bhandara with location and photo - published immediately!
   * Automatically scheduled for 24-hour deletion.
   */
  public async submitEvent(formData: EventSubmissionFormData): Promise<BhandaraEvent> {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const locationText = (formData.address || '').trim();
    const userName = (formData.organizer_name || 'Community Devotee').trim();
    const eventTitle = formData.title?.trim() || `Bhandara at ${locationText}`;
    const expiresAt = new Date(now.getTime() + EVENT_TTL_MS).toISOString();

    const newEvent: BhandaraEvent = {
      id: `bh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: eventTitle,
      category: formData.category || 'bhandara',
      description: formData.description?.trim() || `Community Mahaprasad organized by ${userName} at ${locationText}. All devotees and citizens welcome.`,
      organizer_name: userName,
      contact_phone: formData.contact_phone || '',
      event_date: formData.event_date || todayStr,
      start_time: formData.start_time || '11:30',
      end_time: formData.end_time || '16:00',
      venue_name: locationText,
      address: locationText,
      locality: formData.locality?.trim() || locationText,
      city: formData.city || 'Amravati',
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      menu_details: formData.menu_details?.trim() || 'Mahaprasad / Community Meal',
      instructions: formData.instructions || '',
      image_url:
        formData.image_url ||
        'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80',
      status: 'approved', // Published immediately for all users to view and find!
      is_demo: false,
      created_at: now.toISOString(),
      expires_at: expiresAt, // Explicit 24-hr auto-expiry timestamp
      verified_at: now.toISOString(),
    };

    const updated = [newEvent, ...this.eventsCache];
    this.saveEventsToLocal(updated);
    return newEvent;
  }

  /**
   * Update event details or status
   */
  public async updateEvent(id: string, updates: Partial<BhandaraEvent>): Promise<BhandaraEvent> {
    const index = this.eventsCache.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('Event not found');
    }

    const modified = { ...this.eventsCache[index], ...updates, updated_at: new Date().toISOString() };
    const updatedList = [...this.eventsCache];
    updatedList[index] = modified;
    this.saveEventsToLocal(updatedList);
    return modified;
  }

  /**
   * Update status (e.g. mark cancelled, approved, rejected)
   */
  public async updateEventStatus(
    id: string,
    status: EventStatus,
    reason?: string,
    verifiedBy?: string
  ): Promise<BhandaraEvent> {
    return this.updateEvent(id, {
      status,
      rejection_reason: reason,
      verified_by: verifiedBy,
      verified_at: status === 'approved' ? new Date().toISOString() : undefined,
    });
  }

  /**
   * Remove a Bhandara event
   */
  public async deleteEvent(id: string): Promise<boolean> {
    const filtered = this.eventsCache.filter((e) => e.id !== id);
    this.saveEventsToLocal(filtered);
    return true;
  }

  /**
   * Submit an issue report
   */
  public async reportEvent(reportData: EventReportFormData): Promise<EventReport> {
    const newReport: EventReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      event_id: reportData.event_id,
      event_title: reportData.event_title,
      report_type: reportData.report_type,
      description: reportData.description,
      reporter_contact: reportData.reporter_contact || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const updated = [newReport, ...this.reportsCache];
    this.saveReportsToLocal(updated);
    return newReport;
  }

  /**
   * Get all reports
   */
  public async getReports(): Promise<EventReport[]> {
    return [...this.reportsCache];
  }

  /**
   * Update report status
   */
  public async updateReportStatus(id: string, status: 'resolved' | 'dismissed'): Promise<EventReport> {
    const index = this.reportsCache.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Report not found');
    const updated = { ...this.reportsCache[index], status };
    const list = [...this.reportsCache];
    list[index] = updated;
    this.saveReportsToLocal(list);
    return updated;
  }

  /**
   * Clear all local events
   */
  public clearAllEvents() {
    this.saveEventsToLocal([]);
  }
}

export const eventService = new EventService();
