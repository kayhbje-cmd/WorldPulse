// src/App.tsx - Dual Desktop & Mobile View Civic Portal
import React, { useState, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Problem } from './types';
import { problemService } from './services/problem.service';
import { Feed } from './pages/tabs/Feed';
import { MapView } from './pages/tabs/Map';
import { PostProblem } from './pages/tabs/Post';
import { Activity } from './pages/tabs/Activity';
import { Profile } from './pages/tabs/Profile';
import { ProblemDetails } from './pages/ProblemDetails';
import { ComplaintTracking } from './pages/ComplaintTracking';
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { GovTechDemo } from './pages/GovTechDemo';
import { ChatScreen } from './pages/Chat';
import { EditProfile } from './pages/EditProfile';
import { LanguageSelector } from './components/LanguageSelector';
import { UserPersonaSwitcher } from './components/UserPersonaSwitcher';
import { RealtimeToastNotification } from './components/RealtimeToastNotification';
import { VoiceBotFAB } from './components/VoiceBotFAB';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useGeolocation } from './hooks/useGeolocation';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { 
  Home, 
  Map as MapIcon, 
  Plus, 
  Activity as ActivityIcon, 
  User as UserIcon, 
  Bell, 
  MapPin, 
  Monitor, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Building2,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

type TabType = 'feed' | 'map' | 'post' | 'activity' | 'profile';

type ScreenType =
  | { type: 'tab'; tab: TabType }
  | { type: 'problem_details'; problemId: string }
  | { type: 'problem_tracking'; problem: Problem }
  | { type: 'chat'; problem: Problem }
  | { type: 'officer_dashboard' }
  | { type: 'govtech_demo' }
  | { type: 'edit_profile' };

const MainContent: React.FC = () => {
  const { user, isOfficer } = useAuth();
  const { language, t } = useLanguage();
  const { location } = useGeolocation();

  // Responsive default: Mobile if screen < 768px, else Desktop
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'mobile';
    }
    return (localStorage.getItem('janmitra_view_mode') as 'desktop' | 'mobile') || 'desktop';
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>({
    type: 'tab',
    tab: 'feed',
  });

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [postInitialData, setPostInitialData] = useState<{ category?: string; title?: string } | undefined>();

  const handleSetViewMode = (mode: 'desktop' | 'mobile') => {
    setViewMode(mode);
    localStorage.setItem('janmitra_view_mode', mode);
  };

  // Fetch unread count for badge
  const unreadAlertsCount = useMemo(() => {
    return problemService.getStoredAlerts().filter((a) => !a.read).length;
  }, [currentScreen]);

  const activeTab: TabType = currentScreen.type === 'tab' ? currentScreen.tab : 'feed';

  const navigateToTab = (tab: TabType) => {
    setCurrentScreen({ type: 'tab', tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sub-component: The actual Civic Application UI
  const renderAppContent = (isMobileFrame = false) => (
    <div className={`flex flex-col bg-gray-50/50 text-gray-900 font-sans ${isMobileFrame ? 'min-h-full' : 'min-h-screen'}`}>
      <OfflineIndicator />
      <RealtimeToastNotification
        onViewProblem={(probId) =>
          setCurrentScreen({ type: 'problem_details', problemId: probId })
        }
      />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className={`mx-auto px-2.5 sm:px-4 h-15 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3 ${viewMode === 'desktop' && !isMobileFrame ? 'max-w-7xl' : 'max-w-4xl'}`}>
          {/* Logo & Civic Branding */}
          <div
            onClick={() => navigateToTab('feed')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-linear-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <span className="text-lg sm:text-xl">🏛️</span>
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                  JanMitra
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                  {isOfficer ? 'OFFICER' : 'NAGRIK'}
                </span>
              </div>
              <div className="hidden xs:flex sm:flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 font-medium">
                <MapPin size={10} className="text-emerald-600" />
                <span className="truncate max-w-[85px] sm:max-w-[180px]">
                  {location ? 'Mumbai Metro' : t('currentLocation', 'Maharashtra')}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (Visible only on Desktop View) */}
          {viewMode === 'desktop' && !isMobileFrame && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => navigateToTab('feed')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home size={15} />
                <span>Feed</span>
              </button>
              <button
                onClick={() => navigateToTab('map')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MapIcon size={15} />
                <span>Civic Map</span>
              </button>
              <button
                onClick={() => navigateToTab('post')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} className="stroke-[2.5]" />
                <span>Report Issue</span>
              </button>
              <button
                onClick={() => navigateToTab('activity')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative cursor-pointer ${
                  activeTab === 'activity'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ActivityIcon size={15} />
                <span>Activity</span>
                {unreadAlertsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => navigateToTab('profile')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <UserIcon size={15} />
                <span>Profile</span>
              </button>
            </nav>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* View Mode Toggle: Desktop / Mobile */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200 shadow-2xs shrink-0">
              <button
                onClick={() => handleSetViewMode('desktop')}
                title="Desktop View"
                className={`flex items-center gap-1 px-1.5 py-1 sm:px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  viewMode === 'desktop'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Monitor size={12} className="shrink-0" />
                <span className="hidden md:inline">Desktop</span>
              </button>
              <button
                onClick={() => handleSetViewMode('mobile')}
                title="Mobile View"
                className={`flex items-center gap-1 px-1.5 py-1 sm:px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  viewMode === 'mobile'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Smartphone size={12} className="shrink-0" />
                <span className="hidden md:inline">Mobile</span>
              </button>
            </div>

            <UserPersonaSwitcher />
            <LanguageSelector variant="badge" />

            {/* Notification Bell */}
            <button
              onClick={() => navigateToTab('activity')}
              aria-label="Notifications"
              className="relative p-1.5 sm:p-2 rounded-xl text-gray-600 hover:text-emerald-700 hover:bg-gray-100 transition cursor-pointer shrink-0"
            >
              <Bell size={16} />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* User Avatar */}
            <button
              onClick={() => navigateToTab('profile')}
              aria-label="User Profile"
              className="p-0.5 rounded-full border-2 border-emerald-500/60 hover:border-emerald-600 transition cursor-pointer shrink-0"
            >
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                alt={user?.name || 'Profile'}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className={`flex-1 w-full mx-auto pb-24 ${viewMode === 'desktop' && !isMobileFrame ? 'max-w-7xl px-4 py-6' : 'max-w-4xl px-3 sm:px-4 py-4'}`}>
        {/* DESKTOP 2-COLUMN VIEW FOR FEED */}
        {viewMode === 'desktop' && !isMobileFrame && currentScreen.type === 'tab' && currentScreen.tab === 'feed' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Main Feed */}
            <div className="lg:col-span-8">
              <Feed
                onSelectProblem={(prob) =>
                  setCurrentScreen({ type: 'problem_details', problemId: prob.id })
                }
                onNavigateToPost={() => navigateToTab('post')}
                onNavigateToMap={() => navigateToTab('map')}
              />
            </div>

            {/* Right 4 Columns: Desktop Civic Insights Panel */}
            <div className="lg:col-span-4 space-y-5 sticky top-22">
              {/* Quick Report CTA */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-emerald-800 to-teal-900 text-white shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📢</span>
                  <Badge variant="success" size="sm">24/7 Redressal</Badge>
                </div>
                <h3 className="font-extrabold text-base">Spot a Civic Issue?</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Report potholes, garbage dumps, water leaks, or streetlights. Field engineers receive alerts directly.
                </p>
                <Button
                  variant="secondary"
                  className="w-full text-xs font-bold py-2.5"
                  onClick={() => navigateToTab('post')}
                >
                  <Plus size={16} />
                  <span>Report Issue Now</span>
                </Button>
              </div>

              {/* Civic Ward Statistics */}
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-600" />
                    <span>Live Ward Metrics</span>
                  </h4>
                  <span className="text-[11px] text-gray-400">Maharashtra Metro</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xl font-extrabold text-emerald-800">142</div>
                    <div className="text-[11px] font-medium text-emerald-700">Resolved Today</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-xl font-extrabold text-blue-800">18</div>
                    <div className="text-[11px] font-medium text-blue-700">In Progress</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="text-xl font-extrabold text-amber-800">94.2%</div>
                    <div className="text-[11px] font-medium text-amber-700">SLA On-Time</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="text-xl font-extrabold text-purple-800">42 min</div>
                    <div className="text-[11px] font-medium text-purple-700">Avg Response</div>
                  </div>
                </div>
              </Card>

              {/* Emergency Civic Helplines */}
              <Card className="p-5 space-y-3">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <PhoneCall size={16} className="text-emerald-600" />
                  <span>Emergency Municipal Lines</span>
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Disaster Control</span>
                    <strong className="text-gray-900">1916</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Water Supply Emergency</span>
                    <strong className="text-gray-900">+91 22 2269 1234</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>PWD & Roads Helpline</span>
                    <strong className="text-gray-900">+91 22 2262 0530</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Solid Waste & Sanitation</span>
                    <strong className="text-gray-900">+91 22 2413 4567</strong>
                  </div>
                </div>
              </Card>

              {/* Direct Mobile Link Banner */}
              <div className="p-4 rounded-2xl bg-gray-100 border border-gray-200 text-xs text-gray-600 space-y-1.5">
                <div className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-emerald-600" />
                  <span>Open on Real Mobile</span>
                </div>
                <p className="text-[11px]">
                  Visit <strong className="text-gray-900 font-mono">http://10.166.28.197:3000</strong> on your phone connected to the same Wi-Fi.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD / MOBILE CONTAINER ROUTING */
          <>
            {currentScreen.type === 'tab' && currentScreen.tab === 'feed' && (
              <Feed
                onSelectProblem={(prob) =>
                  setCurrentScreen({ type: 'problem_details', problemId: prob.id })
                }
                onNavigateToPost={() => navigateToTab('post')}
                onNavigateToMap={() => navigateToTab('map')}
              />
            )}

            {currentScreen.type === 'tab' && currentScreen.tab === 'map' && (
              <MapView
                onSelectProblem={(prob) =>
                  setCurrentScreen({ type: 'problem_details', problemId: prob.id })
                }
                onNavigateToPost={() => navigateToTab('post')}
              />
            )}

            {currentScreen.type === 'tab' && currentScreen.tab === 'post' && (
              <PostProblem
                initialData={postInitialData}
                onSuccess={(newProb) => {
                  setCurrentScreen({ type: 'problem_details', problemId: newProb.id });
                  setPostInitialData(undefined);
                }}
              />
            )}

            {currentScreen.type === 'tab' && currentScreen.tab === 'activity' && (
              <Activity
                onSelectProblem={(prob) =>
                  setCurrentScreen({ type: 'problem_details', problemId: prob.id })
                }
                onTrackProblem={(prob) =>
                  setCurrentScreen({ type: 'problem_tracking', problem: prob })
                }
                onNavigateToPost={() => navigateToTab('post')}
              />
            )}

            {currentScreen.type === 'tab' && currentScreen.tab === 'profile' && (
              <Profile
                onNavigateToGovTech={() => setCurrentScreen({ type: 'govtech_demo' })}
                onNavigateToOfficerPortal={() => setCurrentScreen({ type: 'officer_dashboard' })}
                onEditProfile={() => setCurrentScreen({ type: 'edit_profile' })}
              />
            )}

            {currentScreen.type === 'problem_details' && (
              <ProblemDetails
                problemId={currentScreen.problemId}
                onBack={() => setCurrentScreen({ type: 'tab', tab: 'feed' })}
                onNavigateToMap={() => navigateToTab('map')}
                onOpenChat={(prob) => setCurrentScreen({ type: 'chat', problem: prob })}
              />
            )}

            {currentScreen.type === 'problem_tracking' && (
              <ComplaintTracking
                problem={currentScreen.problem}
                onBack={() => setCurrentScreen({ type: 'tab', tab: 'activity' })}
              />
            )}

            {currentScreen.type === 'officer_dashboard' && (
              <OfficerDashboard
                onSelectProblem={(prob) =>
                  setCurrentScreen({ type: 'problem_details', problemId: prob.id })
                }
                onExitOfficerMode={() => setCurrentScreen({ type: 'tab', tab: 'profile' })}
              />
            )}

            {currentScreen.type === 'govtech_demo' && (
              <GovTechDemo onBack={() => setCurrentScreen({ type: 'tab', tab: 'profile' })} />
            )}

            {currentScreen.type === 'chat' && (
              <ChatScreen
                problem={currentScreen.problem}
                onBack={() =>
                  setCurrentScreen({ type: 'problem_details', problemId: currentScreen.problem.id })
                }
              />
            )}

            {currentScreen.type === 'edit_profile' && (
              <EditProfile onBack={() => setCurrentScreen({ type: 'tab', tab: 'profile' })} />
            )}
          </>
        )}
      </main>

      {/* Floating Voice Assistant Trigger (VoiceBotFAB) */}
      <VoiceBotFAB
        onClick={() => setIsVoiceModalOpen(true)}
        className={
          isMobileFrame
            ? "absolute right-4 bottom-20 z-40 w-12 h-12 rounded-full bg-linear-to-r from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-700/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-emerald-500/20"
            : undefined
        }
      />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateTab={(tabName) => {
          if (['feed', 'map', 'post', 'activity', 'profile'].includes(tabName)) {
            navigateToTab(tabName as TabType);
          }
        }}
        onAutoFillReport={(data) => {
          setPostInitialData(data);
          navigateToTab('post');
        }}
      />

      {/* Bottom Sticky Tab Navigation Bar */}
      <nav className={`${isMobileFrame ? 'absolute' : 'fixed'} bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg`}>
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* Feed */}
          <button
            onClick={() => navigateToTab('feed')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'text-emerald-700 font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home size={20} className={activeTab === 'feed' ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px] mt-1">{t('tabFeed', 'Feed')}</span>
          </button>

          {/* Map */}
          <button
            onClick={() => navigateToTab('map')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'text-emerald-700 font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <MapIcon size={20} className={activeTab === 'map' ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px] mt-1">{t('tabMap', 'Civic Map')}</span>
          </button>

          {/* Elevated Center Post Button */}
          <div className="flex-1 flex justify-center -mt-6">
            <button
              onClick={() => navigateToTab('post')}
              className="w-14 h-14 rounded-full bg-linear-to-tr from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-700/35 flex items-center justify-center hover:scale-105 active:scale-95 transition-all ring-4 ring-white cursor-pointer"
              aria-label="Post Civic Problem"
            >
              <Plus size={28} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Activity */}
          <button
            onClick={() => navigateToTab('activity')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative cursor-pointer ${
              activeTab === 'activity'
                ? 'text-emerald-700 font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ActivityIcon size={20} className={activeTab === 'activity' ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px] mt-1">{t('tabActivity', 'Activity')}</span>
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigateToTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'text-emerald-700 font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <UserIcon size={20} className={activeTab === 'profile' ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px] mt-1">{t('tabProfile', 'Profile')}</span>
          </button>
        </div>
      </nav>
    </div>
  );

  // If "Mobile View" is selected AND screen is a desktop/laptop (>= 768px):
  // Render inside the authentic smartphone device frame!
  if (viewMode === 'mobile') {
    return (
      <div className="min-h-screen bg-slate-900/95 py-6 px-4 flex flex-col items-center justify-center relative">
        {/* Floating Top Control Bar */}
        <div className="w-full max-w-md mb-4 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">📱 Mobile Preview (393 × 852)</span>
          </div>

          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => handleSetViewMode('desktop')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition font-medium cursor-pointer"
            >
              <Monitor size={14} />
              <span>Desktop View</span>
            </button>
            <button
              onClick={() => handleSetViewMode('mobile')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold transition shadow-xs cursor-pointer"
            >
              <Smartphone size={14} />
              <span>Mobile View</span>
            </button>
          </div>
        </div>

        {/* Smartphone Chassis Mockup */}
        <div className="w-full max-w-[393px] h-[852px] max-h-[90vh] rounded-[52px] border-[10px] border-slate-950 shadow-2xl ring-1 ring-white/10 relative flex flex-col bg-white overflow-hidden">
          {/* Dynamic Island Pill */}
          <div className="w-28 h-6 bg-slate-950 rounded-full mx-auto absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-end px-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          {/* Simulated Mobile Status Bar */}
          <div className="h-10 bg-white/90 backdrop-blur-md px-6 flex items-end justify-between pb-1 text-[11px] font-bold text-gray-800 select-none shrink-0 z-40">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Signal size={12} />
              <Wifi size={12} />
              <Battery size={13} className="fill-current" />
            </div>
          </div>

          {/* Inner Phone Screen Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
            {renderAppContent(true)}
          </div>
        </div>

        {/* Real phone link hint below the phone frame */}
        <p className="mt-4 text-[11px] text-slate-400">
          💡 For testing on your real phone, open <strong className="text-white font-mono">http://10.166.28.197:3000</strong> on mobile Safari/Chrome.
        </p>
      </div>
    );
  }

  // DESKTOP FULL-WIDTH VIEW
  return renderAppContent(false);
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
