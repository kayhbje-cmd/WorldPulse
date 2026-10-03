// src/pages/tabs/Profile.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { PWAInstallButton } from '../../components/PWAInstallButton';
import { 
  User, 
  Settings, 
  Globe, 
  BarChart3, 
  ShieldCheck, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Download,
  Building2,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface Props {
  onNavigateToGovTech: () => void;
  onNavigateToOfficerPortal: () => void;
  onEditProfile: () => void;
}

export const Profile: React.FC<Props> = ({
  onNavigateToGovTech,
  onNavigateToOfficerPortal,
  onEditProfile,
}) => {
  const { user, isOfficer, switchRole, logout } = useAuth();
  const { t } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <div className="pb-28 pt-2 px-4 max-w-xl mx-auto space-y-5">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160'}
              alt={user?.name || 'Citizen'}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
            />
            {isOfficer && (
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-blue-600 text-white shadow-xs">
                OFFICER
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">
              {user?.name || 'Aarav Sharma'}
            </h2>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'citizen@janmitra.app'}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {isOfficer ? 'Municipal Engineer' : 'Verified Citizen'}
              </span>
              <button
                onClick={onEditProfile}
                className="text-[11px] text-gray-400 hover:text-gray-700 underline font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* 3 Stats Minimal Cards */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-gray-100 text-center">
          <div>
            <div className="text-lg font-black text-gray-900">
              {user?.problems_posted || 3}
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              {t('statsPosted', 'Reported')}
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-gray-900">
              12
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              {t('statsHelping', 'Help Offers')}
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-emerald-600">
              {user?.problems_solved || 1}
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              {t('statsSolved', 'Resolved')}
            </div>
          </div>
        </div>
      </div>

      {/* Role Switch Banner */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Building2 size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-900">
              {isOfficer ? 'Operating in Officer Mode' : 'Municipal Officer Portal'}
            </h4>
            <p className="text-[11px] text-blue-700">
              {isOfficer ? 'Er. Rajesh Kulkarni (PWD West)' : 'Field verification & status updates'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isOfficer) {
              switchRole('citizen');
            } else {
              switchRole('officer');
              onNavigateToOfficerPortal();
            }
          }}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          {isOfficer ? 'Citizen Mode' : 'Switch Mode'}
        </button>
      </div>

      {/* PWA Install Button Prominent Bar */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Download size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">Install JanMitra PWA</h4>
            <p className="text-[11px] text-emerald-800">Fast offline access & emergency alerts</p>
          </div>
        </div>
        <PWAInstallButton />
      </div>

      {/* Navigation Menu Options */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs divide-y divide-gray-100 overflow-hidden">
        <button
          onClick={onEditProfile}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <User size={18} className="text-gray-400" />
            <span className="text-xs font-bold">Edit Profile & Phone</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        <button
          onClick={() => setShowLanguageModal(true)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <Globe size={18} className="text-gray-400" />
            <span className="text-xs font-bold">{t('languageSettings', 'Language / भाषा निवडा')}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector variant="badge" />
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </button>

        <button
          onClick={onNavigateToGovTech}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <BarChart3 size={18} className="text-emerald-600" />
            <span className="text-xs font-bold">{t('govTechDemo', 'GovTech Analytics Demo')}</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Live SLA
          </span>
        </button>

        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <Info size={18} className="text-gray-400" />
            <span className="text-xs font-bold">About JanMitra & Citizen Charter</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center justify-between p-4 hover:bg-red-50/50 transition text-left text-red-600 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span className="text-xs font-bold">Sign Out</span>
          </div>
        </button>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Select Portal Language</h3>
            <LanguageSelector variant="full" />
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-3.5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <h3 className="text-base font-black text-gray-900">JanMitra Citizen Civic Portal</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              JanMitra (NagrikSeva) is an open, transparent citizen grievance redressal platform engineered to bridge residents, municipal engineers, and public works departments.
            </p>
            <div className="space-y-2 text-xs text-gray-700 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <div className="font-bold text-emerald-800">Civic Redressal SLA Commitments:</div>
              <div>• Critical Emergencies (Live Wires, Gas Leaks): &lt; 4 Hours</div>
              <div>• Water Pipeline Ruptures & Drainage Overflows: &lt; 24 Hours</div>
              <div>• Road Potholes & Infrastructure Milling: &lt; 72 Hours</div>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
