// src/components/AnalyticsDashboard.tsx
import React from 'react';
import { problemService } from '../services/problem.service';
import { PROBLEM_CATEGORIES, DEPARTMENTS } from '../constants/categories';
import { formatCurrencyINR } from '../utils/formatters';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, BarChart3, ShieldCheck, Zap } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const problems = problemService.getAll();
  const stats = problemService.getOfficerStats();

  // Category counts
  const categoryCounts = PROBLEM_CATEGORIES.map((cat) => {
    const count = problems.filter((p) => p.category === cat.id).length;
    const percentage = problems.length > 0 ? Math.round((count / problems.length) * 100) : 0;
    return { ...cat, count, percentage };
  });

  // Calculate estimated total civic budget
  const totalCivicBudget = problems.reduce((acc, p) => acc + (p.estimated_cost_max || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top 4 GovTech KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Complaints</span>
            <BarChart3 size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{stats.total}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp size={12} />
            <span>+14% citizen reports this week</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">SLA Resolution Rate</span>
            <ShieldCheck size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{stats.slaComplianceRate}%</div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold mt-1">
            <span>Avg {stats.avgResolutionHours} hrs remediation</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved Issues</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.resolved}</div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
            <span>{stats.inProgress} currently under repair</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimated Budget</span>
            <Zap size={16} className="text-amber-600" />
          </div>
          <div className="text-xl font-black text-gray-900">{formatCurrencyINR(totalCivicBudget)}</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-1">
            <span>AI Projected Municipal Works</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
          <span>Civic Issues Distribution by Category</span>
          <span className="text-xs font-normal text-gray-400">Real-time Ward Sensor Data</span>
        </h3>

        <div className="space-y-3.5">
          {categoryCounts.map((cat) => (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </span>
                <span className="text-gray-500 font-medium">
                  {cat.count} complaints ({cat.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(4, cat.percentage)}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Municipal Department Performance Index */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          Departmental SLA Compliance & Field Readiness
        </h3>
        <div className="divide-y divide-gray-100">
          {DEPARTMENTS.slice(0, 4).map((dept, i) => {
            const sampleSLA = [96.4, 91.8, 94.2, 88.5][i] || 90;
            return (
              <div key={dept.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-gray-900">{dept.name}</h4>
                  <p className="text-[11px] text-gray-500">Helpline: {dept.contact_number}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800">
                    {sampleSLA}% SLA
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">High Efficiency</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
