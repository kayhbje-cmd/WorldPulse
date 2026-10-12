// src/types/index.ts - Core types for Bhandara Finder

export type EventCategory = 
  | 'bhandara'
  | 'mahaprasad'
  | 'annadan'
  | 'temple_feast'
  | 'community_meals';

export type EventStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed';

export type ComputedLiveStatus = 
  | 'currently_serving'
  | 'upcoming'
  | 'completed'
  | 'cancelled';

export interface BhandaraEvent {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  organizer_name: string;
  contact_phone: string;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm (24-hour)
  end_time: string;   // HH:mm (24-hour)
  venue_name: string;
  address: string;
  locality: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  menu_details: string;
  instructions?: string;
  image_url?: string;
  status: EventStatus;
  is_demo: boolean;
  created_at: string;
  updated_at?: string;
  rejection_reason?: string;
  verified_at?: string;
  verified_by?: string;
  distance_km?: number;
}

export type ReportType = 
  | 'wrong_time' 
  | 'wrong_venue' 
  | 'cancelled_not_updated' 
  | 'duplicate' 
  | 'fake_event' 
  | 'other';

export interface EventReport {
  id: string;
  event_id: string;
  event_title: string;
  report_type: ReportType;
  description: string;
  reporter_contact?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator';
}

export type TimeFilterOption = 'all' | 'today' | 'currently_serving' | 'upcoming' | 'completed';
export type SortOption = 'upcoming' | 'nearest' | 'recently_added';

export interface FilterState {
  searchQuery: string;
  category: EventCategory | 'all';
  timeFilter: TimeFilterOption;
  locality: string;
  sortBy: SortOption;
}

export interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  accuracy?: number | null;
  error?: string | null;
  isLoading: boolean;
}
