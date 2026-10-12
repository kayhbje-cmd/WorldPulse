-- supabase/schema.sql
-- Production SQL Schema and Row Level Security (RLS) for Bhandara Finder
-- Focus: Amravati, Maharashtra, India

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('bhandara', 'mahaprasad', 'annadan', 'temple_feast', 'community_meals')),
  description TEXT NOT NULL,
  organizer_name VARCHAR(120) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  event_date DATE NOT NULL,
  start_time VARCHAR(10) NOT NULL,
  end_time VARCHAR(10) NOT NULL,
  venue_name VARCHAR(180) NOT NULL,
  address TEXT NOT NULL,
  locality VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Amravati',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  menu_details TEXT NOT NULL,
  instructions TEXT,
  image_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')),
  is_demo BOOLEAN NOT NULL DEFAULT false,
  rejection_reason TEXT,
  verified_at TIMESTAMPTZ,
  verified_by VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexing for fast search and filtering
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_locality ON public.events(locality);
CREATE INDEX IF NOT EXISTS idx_events_city ON public.events(city);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);

-- 2. Event Reports Table
CREATE TABLE IF NOT EXISTS public.event_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  event_title VARCHAR(150) NOT NULL,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('wrong_time', 'wrong_venue', 'cancelled_not_updated', 'duplicate', 'fake_event', 'other')),
  description TEXT NOT NULL,
  reporter_contact VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_event_id ON public.event_reports(event_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.event_reports(status);

-- 3. Admin Profiles Table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to verify admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for events:
-- 1. Public can read ONLY approved events
DROP POLICY IF EXISTS "Public can view approved events" ON public.events;
CREATE POLICY "Public can view approved events"
ON public.events FOR SELECT
USING (status = 'approved');

-- 2. Anyone can submit a pending event
DROP POLICY IF EXISTS "Public can submit pending events" ON public.events;
CREATE POLICY "Public can submit pending events"
ON public.events FOR INSERT
WITH CHECK (status = 'pending');

-- 3. Admins can view all events (including pending, rejected, cancelled)
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
CREATE POLICY "Admins can view all events"
ON public.events FOR SELECT
USING (public.is_admin());

-- 4. Admins can update any event
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
ON public.events FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Admins can delete spam or duplicates
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
ON public.events FOR DELETE
USING (public.is_admin());

-- Policies for event_reports:
-- Public can submit reports
DROP POLICY IF EXISTS "Public can create reports" ON public.event_reports;
CREATE POLICY "Public can create reports"
ON public.event_reports FOR INSERT
WITH CHECK (true);

-- Admins can view and manage reports
DROP POLICY IF EXISTS "Admins can view reports" ON public.event_reports;
CREATE POLICY "Admins can view reports"
ON public.event_reports FOR SELECT
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update reports" ON public.event_reports;
CREATE POLICY "Admins can update reports"
ON public.event_reports FOR UPDATE
USING (public.is_admin());

-- 6. Storage Bucket for Event Posters / Photos
-- Insert bucket configuration for Supabase Storage if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-posters', 'event-posters', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Public can view event posters"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-posters');

CREATE POLICY "Public can upload event posters"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-posters');
