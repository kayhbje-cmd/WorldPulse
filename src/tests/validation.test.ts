// src/tests/validation.test.ts - Unit tests for simplified Zod schemas

import { describe, it, expect } from 'vitest';
import { eventSubmissionSchema, eventReportSchema } from '../utils/validation';

describe('Bhandara Location Upload Zod Validation', () => {
  const validUploadData = {
    organizer_name: 'Ramesh Patil',
    address: 'Near Ambadevi Mandir, Gandhi Chowk, Amravati',
    image_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  };

  it('validates 3-input upload data successfully', () => {
    const result = eventSubmissionSchema.safeParse(validUploadData);
    expect(result.success).toBe(true);
  });

  it('rejects upload when user name is missing or too short', () => {
    const invalidName = {
      ...validUploadData,
      organizer_name: 'R',
    };
    const result = eventSubmissionSchema.safeParse(invalidName);
    expect(result.success).toBe(false);
  });

  it('rejects upload when location address is missing or under 3 characters', () => {
    const invalidAddress = {
      ...validUploadData,
      address: 'Am',
    };
    const result = eventSubmissionSchema.safeParse(invalidAddress);
    expect(result.success).toBe(false);
  });

  it('rejects upload when image is missing', () => {
    const noImage = {
      ...validUploadData,
      image_url: '',
    };
    const result = eventSubmissionSchema.safeParse(noImage);
    expect(result.success).toBe(false);
  });
});

describe('Event Report Zod Validation', () => {
  it('validates legitimate report data', () => {
    const reportData = {
      event_id: 'ev-01',
      event_title: 'Bhandara at Gandhi Chowk',
      report_type: 'wrong_time' as const,
      description: 'The serving time was delayed to 1:00 PM.',
      reporter_contact: '9876543210',
    };
    const result = eventReportSchema.safeParse(reportData);
    expect(result.success).toBe(true);
  });

  it('rejects report with description under 5 characters', () => {
    const shortReport = {
      event_id: 'ev-01',
      event_title: 'Bhandara at Gandhi Chowk',
      report_type: 'wrong_time' as const,
      description: 'bad',
    };
    const result = eventReportSchema.safeParse(shortReport);
    expect(result.success).toBe(false);
  });
});
