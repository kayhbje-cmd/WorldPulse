// src/pages/tabs/Feed.tsx
import React, { useState, useMemo } from 'react';
import { Problem, ProblemStatus } from '../../types';
import { problemService } from '../../services/problem.service';
import { PROBLEM_CATEGORIES, STATUS_CONFIG } from '../../constants/categories';
import { ComplaintStatusBadge } from '../../components/ComplaintStatusBadge';
import { VoteButton } from '../../components/VoteButton';
import { HypeButton } from '../../components/HypeButton';
import { HypeBadge } from '../../components/HypeBadge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { formatTimeAgo, formatDistance, calculateDistanceKm } from '../../utils/formatters';
import { EmptyState, Card } from '../../components/ui';
import { 
  Search, 
  MapPin, 
  Filter, 
  Flame, 
  ArrowUpDown, 
  Share2, 
  Eye, 
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Users
} from 'lucide-react';

interface Props {
  onSelectProblem: (problem: Problem) => void;
  onNavigateToPost: () => void;
  onNavigateToMap: () => void;
}

export const Feed: React.FC<Props> = ({
  onSelectProblem,
  onNavigateToPost,
  onNavigateToMap,
}) => {
  const { language, t, getCategoryName } = useLanguage();
  const { location } = useGeolocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'nearest' | 'trending' | 'most_hyped'>('newest');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Subscribe to real-time additions and updates from other users/devices
  React.useEffect(() => {
    const unsub = problemService.subscribeToChanges(() => {
      setRefreshKey((k) => k + 1);
    });
    return () => unsub();
  }, []);

  // Fetch problems
  const problems = useMemo(() => {
    return problemService.getAll({
      category: selectedCategory,
      status: selectedStatus,
      search: searchQuery,
      sortBy: sortBy,
      userLat: location?.lat,
      userLng: location?.lng,
    });
  }, [selectedCategory, selectedStatus, searchQuery, sortBy, location, refreshKey]);

  // Trending top 3 issues sorted by community hype score
  const trendingProblems = useMemo(() => {
    const all = problemService.getAll();
    return [...all]
      .sort((a, b) => ((b.hype_score || 0) * 3 + b.upvotes * 2) - ((a.hype_score || 0) * 3 + a.upvotes * 2))
      .slice(0, 3);
  }, [refreshKey]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setIsRefreshing(false);
    }, 400);
  };

  const handleShare = (e: React.MouseEvent, problem: Problem) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `JanMitra Issue: ${problem.title}`,
        text: `${problem.title} at ${problem.address}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="pb-24 pt-2">
      {/* Search & Sort Controls Bar */}
      <div className="px-4 mb-3 space-y-2.5">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder', 'Search complaints, roads, ward...')}
            className="w-full bg-white pl-10 pr-10 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter & Sort Chips Row */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {/* Sort Toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gray-200 text-gray-700 rounded-xl px-2.5 py-1.5 font-medium shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="newest">🕒 {t('sortNewest', 'Newest')}</option>
              <option value="most_hyped">🔥 Most Hyped (Community Choice)</option>
              <option value="trending">📈 {t('sortTrending', 'Trending')}</option>
              <option value="nearest">📍 {t('sortNearest', 'Nearest')}</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 rounded-xl px-2.5 py-1.5 font-medium shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">⚡ {t('allStatus', 'All Statuses')}</option>
              <option value="posted">⏳ Submitted</option>
              <option value="being_helped">🔍 In Review</option>
              <option value="in_progress">🛠️ In Progress</option>
              <option value="solved">✅ Resolved</option>
              <option value="escalated">🚨 Escalated</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            aria-label="Refresh complaints"
            className="p-1.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 shadow-2xs active:rotate-180 transition-all shrink-0 cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-emerald-600' : ''} />
          </button>
        </div>
      </div>

      {/* Horizontal Category Filter Chips */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-700/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🌐 All Issues
          </button>
          {PROBLEM_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-700/20'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{getCategoryName(cat.id)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Spotlight (Show only when no specific search active) */}
      {!searchQuery && selectedCategory === 'all' && selectedStatus === 'all' && (
        <div className="mb-5 px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <Flame size={14} className="text-orange-500 fill-orange-500 animate-pulse" />
              <span>{t('trendingAlert', 'Most Hyped Civic Emergencies')}</span>
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">Ranked by Community Hype</span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {trendingProblems.map((prob) => {
              const cat = PROBLEM_CATEGORIES.find((c) => c.id === prob.category);
              return (
                <div
                  key={prob.id}
                  onClick={() => onSelectProblem(prob)}
                  className="w-64 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-2xs p-3 cursor-pointer hover:shadow-md transition active:scale-[0.99]"
                >
                  <div className="relative h-28 rounded-xl overflow-hidden mb-2 bg-gray-100">
                    <img
                      src={prob.images[0]}
                      alt={prob.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                        {cat?.emoji} {cat?.name}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <HypeBadge score={prob.hype_score} size="sm" showTier={false} />
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">
                    {prob.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mb-2">
                    📍 {prob.address}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <ComplaintStatusBadge status={prob.status} size="sm" />
                    <span className="text-[10px] text-gray-400 font-medium">
                      {formatTimeAgo(prob.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Problems Feed List */}
      <div className="px-4 space-y-4">
        {problems.length > 0 ? (
          problems.map((problem) => {
            const cat = PROBLEM_CATEGORIES.find((c) => c.id === problem.category);
            const distKm =
              location && problem.latitude && problem.longitude
                ? calculateDistanceKm(location.lat, location.lng, problem.latitude, problem.longitude)
                : undefined;

            return (
              <Card
                key={problem.id}
                hoverable
                onClick={() => onSelectProblem(problem)}
                className="overflow-hidden"
              >
                {/* Image Header with Badge Overlay */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={problem.images[0]}
                    alt={problem.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1"
                      style={{ backgroundColor: cat?.color || '#16A34A' }}
                    >
                      <span>{cat?.emoji}</span>
                      <span>{getCategoryName(problem.category)}</span>
                    </span>
                    <HypeBadge score={problem.hype_score} size="sm" />
                    {problem.priority_level === 'critical' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-black/60 backdrop-blur-xs text-white">
                      {formatTimeAgo(problem.created_at)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-1.5">
                    {problem.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2.5">
                    {problem.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 mb-3.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{problem.address}</span>
                      {distKm !== undefined && (
                        <span className="shrink-0 text-emerald-700 font-semibold ml-1">
                          • {formatDistance(distKm)}
                        </span>
                      )}
                    </div>
                    {problem.supporting_reports && problem.supporting_reports.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200">
                        <Users size={11} className="text-amber-700" />
                        {problem.supporting_reports.length + 1} citizens confirmed
                      </span>
                    )}
                  </div>

                  {/* Card Footer: User, Status, Hype & Upvotes */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={problem.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'}
                        alt={problem.user?.name || 'Citizen'}
                        className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                      <div className="text-[11px] leading-tight truncate">
                        <span className="font-semibold text-gray-800 block truncate max-w-[100px] sm:max-w-[140px]">
                          {problem.user?.name || 'Citizen'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <HypeButton
                        problemId={problem.id}
                        initialHype={problem.hype_score}
                        hypedBy={problem.hyped_by}
                        size="sm"
                      />
                      <VoteButton
                        problemId={problem.id}
                        initialUpvotes={problem.upvotes}
                        initialDownvotes={problem.downvotes}
                        size="sm"
                      />
                      <button
                        onClick={(e) => handleShare(e, problem)}
                        aria-label="Share problem"
                        className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <EmptyState
            title={t('allClearTitle', 'All Clear! No problems in this filter')}
            description={t('allClearDesc', 'No civic problems matching your current criteria or your area is spick and span!')}
            actionText={t('reportBtn', 'Report a Problem')}
            onAction={onNavigateToPost}
          />
        )}
      </div>
    </div>
  );
};
