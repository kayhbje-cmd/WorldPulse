// src/utils/validation.ts - Simple user-friendly validation for Bhandara Finder

import { z } from 'zod';

export const eventSubmissionSchema = z.object({
  // 1. User Name
  organizer_name: z
    .string()
    .trim()
    .min(2, 'Please enter your name or mandal name'),

  // 2. Bhandara Location
  address: z
    .string()
    .trim()
    .min(3, 'Please enter the Bhandara location / venue name'),

  // 3. Real Image Uploaded from Phone
  image_url: z
    .string()
    .min(5, 'Please upload a photo of the Bhandara or food distribution'),

  // Optional / Auto-filled friendly defaults
  title: z.string().trim().optional(),
  locality: z.string().trim().optional(),
  city: z.string().trim().default('Amravati'),
  event_date: z.string().trim().optional(),
  start_time: z.string().trim().optional(),
  end_time: z.string().trim().optional(),
  menu_details: z.string().trim().optional(),
  description: z.string().trim().optional(),
  instructions: z.string().trim().optional(),
  category: z
    .enum(['bhandara', 'mahaprasad', 'annadan', 'temple_feast', 'community_meals'])
    .default('bhandara'),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  contact_phone: z.string().trim().optional(),
  consent: z.boolean().optional().default(true),
});

export type EventSubmissionFormData = z.infer<typeof eventSubmissionSchema>;

export const eventReportSchema = z.object({
  event_id: z.string().min(1, 'Event ID is required'),
  event_title: z.string().min(1, 'Event title is required'),
  report_type: z.enum([
    'wrong_time',
    'wrong_venue',
    'cancelled_not_updated',
    'duplicate',
    'fake_event',
    'other',
  ]),
  description: z
    .string()
    .trim()
    .min(5, 'Please provide a brief description of the issue'),
  reporter_contact: z.string().trim().optional(),
});

export type EventReportFormData = z.infer<typeof eventReportSchema>;
