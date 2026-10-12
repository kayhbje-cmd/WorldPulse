// src/components/ReportModal.tsx - Report inaccurate or outdated Bhandara info

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BhandaraEvent, ReportType } from '../types';
import { eventReportSchema, EventReportFormData } from '../utils/validation';
import { eventService } from '../services/eventService';

interface ReportModalProps {
  event: BhandaraEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

const REPORT_ISSUES: { id: ReportType; label: string }[] = [
  { id: 'wrong_time', label: 'Incorrect serving time or date' },
  { id: 'wrong_venue', label: 'Wrong venue name or address' },
  { id: 'cancelled_not_updated', label: 'Event has been cancelled by organizers' },
  { id: 'duplicate', label: 'Duplicate listing of an existing event' },
  { id: 'fake_event', label: 'Fake or misleading submission' },
  { id: 'other', label: 'Other discrepancy' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  event,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [reportType, setReportType] = useState<ReportType>('wrong_time');
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload: EventReportFormData = {
      event_id: event.id,
      event_title: event.title,
      report_type: reportType,
      description,
      reporter_contact: reporterContact || undefined,
    };

    const result = eventReportSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await eventService.reportEvent(result.data);
      setIsSubmitting(false);
      onShowToast('Report submitted for admin review. Thank you!', 'success');
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      alert(`Report submission failed: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-rose-900">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold font-['Outfit']">
              Report Incorrect Event Information
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-rose-200/50 flex items-center justify-center text-rose-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs text-stone-700">
            <span className="font-semibold text-stone-500 block">Reporting event:</span>
            <span className="font-bold text-[#291809]">{event.title}</span>
            <span className="block text-stone-500">{event.venue_name}, {event.locality}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              What is the issue? *
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none"
            >
              {REPORT_ISSUES.map((issue) => (
                <option key={issue.id} value={issue.id}>
                  {issue.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Please describe the discrepancy *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Timings have changed to 1 PM or venue is shifted to opposite hall..."
              className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white focus:outline-none ${
                errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-600">{errors.description}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Your Phone Number / Email (Optional, for clarification)
            </label>
            <input
              type="text"
              value={reporterContact}
              onChange={(e) => setReporterContact(e.target.value)}
              placeholder="Optional contact details"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
