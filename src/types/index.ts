// src/types/index.ts

export type Role = 'citizen' | 'officer' | 'department_head' | 'admin';

export interface OfficerProfile {
  id: string;
  department_id: string;
  department_name?: string;
  designation: string;
  is_available: boolean;
  phone?: string;
  badge_number?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  preferred_language?: LanguageCode;
  role: Role;
  department_id?: string;
  employee_id?: string;
  problems_posted: number;
  problems_solved: number;
  is_active: boolean;
  created_at: string;
  officers?: OfficerProfile[];
}

export type ComplaintStatus = 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'escalated' | 'rejected';
export type ProblemStatus = 'posted' | 'being_helped' | 'in_progress' | 'solved' | 'escalated' | 'appeal';
export type Category = 
  | 'infrastructure' 
  | 'sanitation' 
  | 'utilities' 
  | 'safety' 
  | 'access' 
  | 'environment' 
  | 'public_health' 
  | 'other';

export type LanguageCode = 'en' | 'hi' | 'mr';

export interface StatusHistoryItem {
  id: string;
  status: ComplaintStatus;
  label: string;
  changed_by: string;
  role: string;
  notes?: string;
  timestamp: string;
  proof_image?: string;
}

export interface CostAnalysis {
  estimatedCost: { min: number; max: number; currency: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timeToComplete: string;
  materialsNeeded: string[];
  laborRequired: string;
  equipmentNeeded: string[];
  breakdown: { materials: number; labor: number; equipment: number };
  factors: string[];
  recommendations: string;
}

export interface Problem {
  id: string;
  user_id: string;
  category: Category;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: ProblemStatus;
  complaint_status?: ComplaintStatus;
  language_code?: LanguageCode;
  complaint_text_original?: string;
  complaint_text_translated?: string;
  department_id?: string;
  department_name?: string;
  assigned_officer_id?: string;
  assigned_officer_name?: string;
  assigned_officer_designation?: string;
  assigned_officer_phone?: string;
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  helper_id?: string;
  helper_name?: string;
  solved_image?: string;
  solved_note?: string;
  solved_at?: string;
  created_at: string;
  updated_at: string;
  upvotes: number;
  downvotes: number;
  views: number;
  trending_score?: number;
  impact_score?: number;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  affected_people?: number;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  cost_analysis?: CostAnalysis;
  severity_level?: string;
  estimated_completion_time?: string;
  forwarded_to_gov?: boolean;
  escalation_time?: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
    phone?: string;
  };
  distance?: number;
  timeline?: StatusHistoryItem[];
  comments?: ProblemComment[];
}

export interface ProblemComment {
  id: string;
  problem_id: string;
  user_id: string;
  user_name: string;
  user_role: Role;
  text: string;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  name_hi?: string;
  name_mr?: string;
  description?: string;
  category?: Category;
  contact_number?: string;
  is_active: boolean;
}

export interface Officer {
  id: string;
  name: string;
  designation?: string;
  department_id: string;
  department_name?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  is_available: boolean;
  resolved_count: number;
  avatar_url?: string;
}

export interface Alert {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'help_offer' | 'being_helped' | 'solved' | 'comment' | 'new_problem' | 'status_update' | 'assigned' | 'upvote';
  problem_id?: string;
  problem_title?: string;
  from_user_id?: string;
  from_user_name?: string;
  read: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: Role;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: Role;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: Role;
  message: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  problem_id: string;
  problem_title: string;
  officer_name: string;
  citizen_name: string;
  last_message: string;
  updated_at: string;
  unread_count: number;
}
