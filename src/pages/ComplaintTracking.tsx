// src/pages/ComplaintTracking.tsx
import React from 'react';
import { Problem } from '../types';
import { ComplaintStatusBadge } from '../components/ComplaintStatusBadge';
import { ComplaintTimeline } from '../components/ComplaintTimeline';
import { formatTimeAgo } from '../utils/formatters';
import { ArrowLeft, Clock, ShieldCheck, MapPin, Printer } from 'lucide-react';

interface Props {
  problem: Problem;
  onBack: () => void;
}

export const ComplaintTracking: React.FC<Props> = ({ problem, onBack }) => {
  return (
    <div className="pb-28 pt-2 max-w-2xl mx-auto px-4 space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold shadow-2xs cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          onClick={() => window.print()}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold shadow-2xs cursor-pointer"
        >
          <Printer size={15} />
          <span>Print Dossier</span>
        </button>
      </div>

      {/* Ticket Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">
            Ticket #{problem.id}
          </span>
          <ComplaintStatusBadge status={problem.status} />
        </div>

        <h1 className="text-base font-black text-gray-900 leading-snug">
          {problem.title}
        </h1>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={13} className="text-gray-400 shrink-0" />
          <span className="truncate">{problem.address}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Assigned Dept</span>
            <span className="font-semibold text-gray-800">{problem.department_name || 'Public Works Dept'}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Filing Timestamp</span>
            <span className="font-semibold text-gray-800">{new Date(problem.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* SLA Status Tracker */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-4 flex items-center gap-3">
        <ShieldCheck size={24} className="text-emerald-700 shrink-0" />
        <div className="flex-1">
          <h4 className="text-xs font-bold text-emerald-950">Citizen Charter SLA Bound</h4>
          <p className="text-[11px] text-emerald-800 mt-0.5">
            This issue is logged under municipal oversight. Guaranteed inspection within 24 hours.
          </p>
        </div>
      </div>

      {/* Stepper & Chronological Event History */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Clock size={16} className="text-emerald-600" />
          <span>Real-time Remediation Stepper</span>
        </h3>

        <ComplaintTimeline
          currentStatus={problem.status}
          timeline={problem.timeline}
          resolutionNotes={problem.resolution_notes}
          solvedImage={problem.solved_image}
        />
      </div>
    </div>
  );
};
