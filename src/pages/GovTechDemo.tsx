// src/pages/GovTechDemo.tsx
import React from 'react';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { ArrowLeft, Building2, Download, ShieldCheck } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const GovTechDemo: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="pb-28 pt-2 px-4 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold shadow-2xs cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck size={13} />
            <span>GovTech Smart City Certified</span>
          </span>
        </div>
      </div>

      <div className="bg-linear-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold tracking-widest uppercase">
          <Building2 size={16} />
          <span>Municipal Command & Analytics Center</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black">
          JanMitra NagrikSeva GovTech Demo
        </h1>
        <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
          Centralized civic intelligence dashboard monitoring real-time citizen grievance intake, AI cost analysis estimations, contractor work orders, and department-level SLA compliance.
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
};
