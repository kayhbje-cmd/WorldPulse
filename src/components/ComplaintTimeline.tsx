// src/components/ComplaintTimeline.tsx
import React from 'react';
import { StatusHistoryItem, ProblemStatus } from '../types';
import { formatTimeAgo } from '../utils/formatters';
import { CheckCircle2, Clock, Wrench, ShieldAlert, ArrowRight } from 'lucide-react';

interface Props {
  currentStatus: ProblemStatus;
  timeline?: StatusHistoryItem[];
  resolutionNotes?: string;
  solvedImage?: string;
}

export const ComplaintTimeline: React.FC<Props> = ({
  currentStatus,
  timeline = [],
  resolutionNotes,
  solvedImage,
}) => {
  const steps = [
    { key: 'posted', label: 'Submitted' },
    { key: 'being_helped', label: 'In Review' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'solved', label: 'Resolved' },
  ];

  const getStepIndex = (status: ProblemStatus) => {
    switch (status) {
      case 'posted':
        return 0;
      case 'being_helped':
        return 1;
      case 'in_progress':
        return 2;
      case 'solved':
        return 3;
      case 'escalated':
        return 2;
      case 'appeal':
        return 2;
      default:
        return 0;
    }
  };

  const currentIdx = getStepIndex(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Step Progress Bar */}
      <div className="relative flex items-center justify-between px-2">
        {/* Track Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-gray-200 z-0">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((s, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={s.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-white text-gray-400 border-2 border-gray-300'
                } ${isCurrent ? 'scale-110' : ''}`}
              >
                {isDone ? <CheckCircle2 size={15} /> : idx + 1}
              </div>
              <span
                className={`text-[11px] font-semibold mt-1.5 whitespace-nowrap ${
                  isCurrent
                    ? 'text-emerald-700'
                    : isDone
                    ? 'text-gray-800'
                    : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Chronological History Logs */}
      <div className="mt-6 border-l-2 border-emerald-500/30 ml-4 pl-4 space-y-5">
        {timeline.length > 0 ? (
          timeline.map((item, index) => (
            <div key={item.id || index} className="relative group">
              <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
              <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">{item.label}</h4>
                  <span className="text-[10px] text-gray-400">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 mt-0.5 font-medium">
                  <span>{item.changed_by}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">{item.role}</span>
                </div>
                {item.notes && (
                  <p className="text-xs text-gray-600 mt-2 bg-gray-50/80 p-2 rounded-lg leading-relaxed">
                    {item.notes}
                  </p>
                )}
                {item.proof_image && (
                  <div className="mt-2.5">
                    <img
                      src={item.proof_image}
                      alt="Resolution Inspection Proof"
                      className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-400 italic">
            Official progress log will update as municipal inspectors inspect the site.
          </div>
        )}

        {/* Highlight final resolution note if resolved */}
        {currentStatus === 'solved' && resolutionNotes && (
          <div className="relative">
            <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Verified Remediation Report</span>
              </div>
              <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
                {resolutionNotes}
              </p>
              {solvedImage && (
                <div className="mt-2">
                  <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider mb-1">
                    Site Photo After Resolution
                  </p>
                  <img
                    src={solvedImage}
                    alt="After Resolution"
                    className="w-full max-h-48 object-cover rounded-lg border border-emerald-300"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
