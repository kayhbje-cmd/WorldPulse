// src/pages/tabs/Activity.tsx
import React, { useState, useMemo } from 'react';
import { Problem, Alert } from '../../types';
import { problemService } from '../../services/problem.service';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ComplaintStatusBadge } from '../../components/ComplaintStatusBadge';
import { formatTimeAgo } from '../../utils/formatters';
import { EmptyState, Card } from '../../components/ui';
import { 
  Bell, 
  FileText, 
  Users, 
  CheckCheck, 
  ArrowRight, 
  Clock, 
  Eye, 
  ThumbsUp, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface Props {
  onSelectProblem: (problem: Problem) => void;
  onTrackProblem: (problem: Problem) => void;
  onNavigateToPost: () => void;
}

export const Activity: React.FC<Props> = ({
  onSelectProblem,
  onTrackProblem,
  onNavigateToPost,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'my_posts' | 'helping' | 'alerts'>('my_posts');
  const [alertsKey, setAlertsKey] = useState(0);

  React.useEffect(() => {
    const unsub = problemService.subscribeToChanges(() => {
      setAlertsKey((k) => k + 1);
    });
    return () => unsub();
  }, []);

  const userId = user?.id || 'usr-1';

  // My Posted Problems
  const myProblems = useMemo(() => {
    const all = problemService.getAll();
    return all.filter((p) => p.user_id === userId || p.user?.id === userId);
  }, [userId, alertsKey]);

  // Alerts
  const alerts = useMemo(() => {
    return problemService.getStoredAlerts();
  }, [alertsKey]);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const handleMarkAllRead = () => {
    problemService.markAllAlertsRead();
    setAlertsKey((k) => k + 1);
  };

  const handleAlertClick = (alert: Alert) => {
    problemService.markAlertRead(alert.id);
    setAlertsKey((k) => k + 1);

    if (alert.problem_id) {
      const prob = problemService.getById(alert.problem_id);
      if (prob) onSelectProblem(prob);
    }
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">
            {t('activityTitle', 'Activity & Tracking')}
          </h1>
          <p className="text-xs text-gray-500">Live civic updates, community help, and alerts</p>
        </div>

        {unreadAlertsCount > 0 && activeSubTab === 'alerts' && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl transition"
          >
            <CheckCheck size={14} />
            <span>{t('markAllRead', 'Mark all read')}</span>
          </button>
        )}
      </div>

      {/* 3 Tab Switcher */}
      <div className="flex items-center p-1 bg-gray-100/90 rounded-2xl mb-5">
        <button
          onClick={() => setActiveSubTab('my_posts')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'my_posts'
              ? 'bg-white text-emerald-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <FileText size={14} />
          <span>{t('tabMyProblems', 'My Complaints')} ({myProblems.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('helping')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'helping'
              ? 'bg-white text-emerald-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users size={14} />
          <span>{t('tabHelping', 'Community')}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('alerts')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 relative cursor-pointer ${
            activeSubTab === 'alerts'
              ? 'bg-white text-emerald-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Bell size={14} />
          <span>{t('tabNotifications', 'Alerts')}</span>
          {unreadAlertsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center ml-0.5">
              {unreadAlertsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: My Complaints */}
      {activeSubTab === 'my_posts' && (
        <div className="space-y-3.5">
          {myProblems.length > 0 ? (
            myProblems.map((prob) => (
              <Card key={prob.id} hoverable onClick={() => onSelectProblem(prob)} className="p-3.5">
                <div className="flex gap-3">
                  <img
                    src={prob.images[0]}
                    alt={prob.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <ComplaintStatusBadge status={prob.status} size="sm" />
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formatTimeAgo(prob.created_at)}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">
                      {prob.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 truncate mb-2">
                      📍 {prob.address}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]">
                      <div className="flex items-center gap-3 text-gray-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={11} className="text-emerald-600" />
                          <span>{prob.upvotes}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          <span>{prob.views || 0}</span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTrackProblem(prob);
                        }}
                        className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 text-xs cursor-pointer"
                      >
                        <span>{t('trackStatus', 'Track Progress')}</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              title={t('noMyProblems', 'You have not reported any civic issues yet.')}
              description="Be an active nagrik! Report potholes, garbage, or water leaks in your neighborhood."
              actionText={t('reportBtn', 'Report a Problem')}
              onAction={onNavigateToPost}
            />
          )}
        </div>
      )}

      {/* Tab 2: Helping Others / Community */}
      {activeSubTab === 'helping' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck size={20} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Community Volunteer Network</h4>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                JanMitra citizens unite to verify civic repairs, organize local cleanups, and assist senior citizens with accessibility barrier removal.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Community Action Highlights
            </h4>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-gray-800">
                <span>Bandra Clean Street Drive</span>
                <span className="text-emerald-700">Completed ✅</span>
              </div>
              <p className="text-gray-500 text-[11px]">
                24 citizens gathered to clear storm drains along Hill Road. Verified by PWD inspector.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-gray-800">
                <span>Pune Pothole Geotag Marathon</span>
                <span className="text-blue-700">In Progress 🚀</span>
              </div>
              <p className="text-gray-500 text-[11px]">
                112 potholes mapped across Kothrud ward; submitted directly to Municipal Corporation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Alerts & Notifications */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  !alert.read
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    !alert.read
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Bell size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">{alert.title}</h4>
                    <span className="text-[10px] text-gray-400">
                      {formatTimeAgo(alert.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {alert.message}
                  </p>
                  {alert.problem_title && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-2 hover:underline">
                      <span>View Complaint Dossier</span>
                      <ChevronRight size={12} />
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title={t('noAlerts', "You're all caught up! No unread notifications.")}
              description="Notifications will appear here when municipal officers update your complaints."
            />
          )}
        </div>
      )}
    </div>
  );
};
