// src/pages/officer/OfficerDashboard.tsx
import React, { useState, useMemo } from 'react';
import { Problem, ProblemStatus } from '../../types';
import { problemService } from '../../services/problem.service';
import { OFFICERS, PROBLEM_CATEGORIES } from '../../constants/categories';
import { useAuth } from '../../contexts/AuthContext';
import { ComplaintStatusBadge } from '../../components/ComplaintStatusBadge';
import { formatTimeAgo } from '../../utils/formatters';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter, 
  Search, 
  ChevronRight, 
  Wrench, 
  UserCheck, 
  ArrowLeft,
  Flame,
  ShieldAlert
} from 'lucide-react';

interface Props {
  onSelectProblem: (problem: Problem) => void;
  onExitOfficerMode: () => void;
}

export const OfficerDashboard: React.FC<Props> = ({
  onSelectProblem,
  onExitOfficerMode,
}) => {
  const { user } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'assigned_me' | 'in_progress' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Stats
  const stats = useMemo(() => {
    return problemService.getOfficerStats();
  }, [refreshKey]);

  // Problems list
  const problems = useMemo(() => {
    let list = problemService.getAll();
    if (selectedFilter === 'assigned_me') {
      list = list.filter((p) => p.assigned_officer_id === 'off-101' || p.department_id === 'dept-pwd');
    } else if (selectedFilter === 'in_progress') {
      list = list.filter((p) => p.status === 'in_progress' || p.status === 'being_helped');
    } else if (selectedFilter === 'critical') {
      list = list.filter((p) => p.priority_level === 'critical');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
    }
    return list;
  }, [selectedFilter, searchQuery, refreshKey]);

  return (
    <div className="pb-28 pt-2 px-4 max-w-4xl mx-auto space-y-5">
      {/* Officer Header Bar */}
      <div className="bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-5 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160'}
            alt="Officer"
            className="w-13 h-13 rounded-2xl object-cover border-2 border-white/40 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                Officer Desk
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isAvailable ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-950'
                }`}
              >
                {isAvailable ? 'On Duty' : 'Busy in Field'}
              </span>
            </div>
            <h2 className="text-base font-bold mt-0.5">{user?.name || 'Er. Rajesh Kulkarni'}</h2>
            <p className="text-xs text-blue-200">Executive Engineer • PWD Ward West</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
          >
            {isAvailable ? 'Set Busy' : 'Set Active'}
          </button>
          <button
            onClick={onExitOfficerMode}
            className="px-3.5 py-1.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Exit Officer Portal
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Docket</span>
          <span className="text-xl font-black text-gray-900">{stats.total}</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Municipal Complaints</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Critical Urgency</span>
          <span className="text-xl font-black text-red-600">{stats.critical}</span>
          <span className="text-[10px] text-red-500 font-semibold block mt-0.5">SLA &lt; 12 Hours</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">In Remediation</span>
          <span className="text-xl font-black text-purple-600">{stats.inProgress}</span>
          <span className="text-[10px] text-purple-500 font-semibold block mt-0.5">Field Teams Active</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Resolved Total</span>
          <span className="text-xl font-black text-emerald-600">{stats.resolved}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">94% SLA Compliant</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          <div className="flex gap-1.5 p-1 bg-gray-100 rounded-2xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                selectedFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
              }`}
            >
              All Ward Issues ({problemService.getAll().length})
            </button>
            <button
              onClick={() => setSelectedFilter('assigned_me')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                selectedFilter === 'assigned_me' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
              }`}
            >
              Assigned to PWD West
            </button>
            <button
              onClick={() => setSelectedFilter('critical')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                selectedFilter === 'critical' ? 'bg-white text-red-600 shadow-xs' : 'text-gray-500'
              }`}
            >
              🔥 Critical Hazards
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docket or street..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Complaints Docket Table / Cards */}
        <div className="space-y-3">
          {problems.map((prob) => {
            const cat = PROBLEM_CATEGORIES.find((c) => c.id === prob.category);
            return (
              <div
                key={prob.id}
                onClick={() => onSelectProblem(prob)}
                className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-300 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between"
              >
                <div className="flex gap-3 items-center min-w-0 flex-1">
                  <img
                    src={prob.images[0]}
                    alt={prob.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        #{prob.id}
                      </span>
                      <ComplaintStatusBadge status={prob.status} size="sm" />
                      {prob.priority_level === 'critical' && (
                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {prob.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      📍 {prob.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 text-xs">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {formatTimeAgo(prob.created_at)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProblem(prob);
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold rounded-xl flex items-center gap-1 transition"
                  >
                    <span>Manage</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
