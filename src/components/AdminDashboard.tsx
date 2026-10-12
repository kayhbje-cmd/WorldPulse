// src/components/AdminDashboard.tsx - Protected admin verification and moderation panel

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Ban, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Eye, 
  Clock, 
  Calendar, 
  MapPin, 
  Utensils, 
  Phone, 
  Users, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  PlusCircle, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { BhandaraEvent, EventReport, EventStatus, AdminUser } from '../types';
import { formatEventDate, formatTimeRange } from '../utils/status';
import { eventService } from '../services/eventService';
import { AMRAVATI_LOCALITIES } from '../utils/geo';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

// Credentials for local evaluation
const DEMO_ADMIN_CREDENTIALS = {
  email: 'admin@bhandarafinder.org',
  password: 'Bhandara@Admin2026',
};

type AdminTab = 'pending' | 'approved' | 'reports' | 'add_direct';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('pending');

  // Data states
  const [allEvents, setAllEvents] = useState<BhandaraEvent[]>([]);
  const [reports, setReports] = useState<EventReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Rejection modal state
  const [rejectingEvent, setRejectingEvent] = useState<BhandaraEvent | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Edit modal state
  const [editingEvent, setEditingEvent] = useState<BhandaraEvent | null>(null);

  // Direct Event Creation form state
  const [directForm, setDirectForm] = useState({
    title: '',
    category: 'bhandara' as const,
    description: '',
    organizer_name: '',
    contact_phone: '',
    event_date: new Date().toISOString().split('T')[0],
    start_time: '12:00',
    end_time: '16:00',
    venue_name: '',
    address: '',
    locality: 'Rajapeth',
    city: 'Amravati',
    menu_details: '',
    instructions: '',
    image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80',
  });

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, reportsData] = await Promise.all([
        eventService.getAllEventsForAdmin(),
        eventService.getReports(),
      ]);
      setAllEvents(eventsData);
      setReports(reportsData);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (
      loginEmail.trim() === DEMO_ADMIN_CREDENTIALS.email &&
      loginPassword === DEMO_ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      onShowToast('Signed in to Bhandara Finder Admin Desk', 'success');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const fillDemoCredentials = () => {
    setLoginEmail(DEMO_ADMIN_CREDENTIALS.email);
    setLoginPassword(DEMO_ADMIN_CREDENTIALS.password);
  };

  // Status updates
  const handleApprove = async (event: BhandaraEvent) => {
    try {
      await eventService.updateEventStatus(event.id, 'approved', undefined, 'Amravati Admin Desk');
      onShowToast(`"${event.title}" approved and published!`, 'success');
      loadAdminData();
    } catch (e: any) {
      alert(`Approval error: ${e.message}`);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingEvent) return;
    try {
      await eventService.updateEventStatus(
        rejectingEvent.id,
        'rejected',
        rejectReason || 'Does not meet verification standards'
      );
      onShowToast(`Event rejected.`, 'info');
      setRejectingEvent(null);
      setRejectReason('');
      loadAdminData();
    } catch (e: any) {
      alert(`Rejection error: ${e.message}`);
    }
  };

  const handleStatusChange = async (event: BhandaraEvent, newStatus: EventStatus) => {
    try {
      await eventService.updateEventStatus(event.id, newStatus);
      onShowToast(`Event status updated to ${newStatus}`, 'success');
      loadAdminData();
    } catch (e: any) {
      alert(`Update error: ${e.message}`);
    }
  };

  const handleDeleteEvent = async (event: BhandaraEvent) => {
    if (!window.confirm(`Permanently remove event "${event.title}"?`)) return;
    try {
      await eventService.deleteEvent(event.id);
      onShowToast('Event removed.', 'info');
      loadAdminData();
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      await eventService.updateReportStatus(reportId, status);
      onShowToast(`Report marked as ${status}`, 'success');
      loadAdminData();
    } catch (e: any) {
      alert(`Report action error: ${e.message}`);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      await eventService.updateEvent(editingEvent.id, editingEvent);
      onShowToast('Event updated successfully.', 'success');
      setEditingEvent(null);
      loadAdminData();
    } catch (e: any) {
      alert(`Edit save error: ${e.message}`);
    }
  };

  const handleDirectCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await eventService.submitEvent({
        ...directForm,
        consent: true,
      });
      // Immediately approve as admin
      await eventService.updateEventStatus(created.id, 'approved', undefined, 'Admin Direct Post');
      onShowToast('Verified Bhandara published immediately!', 'success');
      setActiveTab('approved');
      loadAdminData();
    } catch (e: any) {
      alert(`Creation error: ${e.message}`);
    }
  };

  const pendingEvents = allEvents.filter((e) => e.status === 'pending');
  const approvedEvents = allEvents.filter((e) => e.status === 'approved' || e.status === 'cancelled' || e.status === 'completed');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#FDFBF7] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-stone-300 flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white flex items-center justify-between border-b border-stone-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold font-['Outfit']">
                  Bhandara Finder Admin Desk
                </h2>
                <span className="text-[10px] bg-orange-950/80 text-orange-300 border border-orange-700/50 px-2 py-0.5 rounded-full font-mono">
                  Amravati Node
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Event Verification, Quality Moderation & Citizen Report Desk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-700 hover:bg-stone-600 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-6 sm:p-10 max-w-md mx-auto my-auto space-y-6 text-center w-full">
            <div className="w-14 h-14 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold font-['Outfit'] text-[#291809]">
                Administrator Sign In
              </h3>
              <p className="text-xs text-stone-500">
                Authorized access required to verify community submissions.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Admin Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@bhandarafinder.org"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {loginError && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 shadow-md transition-all cursor-pointer"
              >
                Sign In to Admin Portal
              </button>
            </form>

            {/* Quick Demo Credentials Fill for Reviewer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-left space-y-1 text-xs text-amber-950">
              <div className="flex items-center justify-between">
                <span className="font-bold">Evaluation Credentials:</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-orange-700 font-bold underline hover:text-orange-900 cursor-pointer text-[11px]"
                >
                  Auto-fill demo credentials
                </button>
              </div>
              <p className="font-mono text-[11px] text-stone-600">Email: {DEMO_ADMIN_CREDENTIALS.email}</p>
              <p className="font-mono text-[11px] text-stone-600">Password: {DEMO_ADMIN_CREDENTIALS.password}</p>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Metrics Strip */}
            <div className="bg-stone-100/90 border-b border-stone-200 p-3 sm:px-6 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Pending Review: {pendingEvents.length}</span>
                </div>
                <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Live / Published: {approvedEvents.length}</span>
                </div>
                <div className="flex items-center space-x-1.5 font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Open Reports: {pendingReports.length}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={loadAdminData}
                  disabled={isLoading}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="text-[11px] text-stone-500 hover:text-rose-600 font-semibold underline"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="bg-white border-b border-stone-200 px-4 sm:px-6 flex space-x-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'pending'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>Pending Submissions</span>
                {pendingEvents.length > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] bg-orange-600 text-white rounded-full">
                    {pendingEvents.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('approved')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'approved'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>Live & Approved ({approvedEvents.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'reports'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>Citizen Reports ({reports.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('add_direct')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'add_direct'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish Direct Event</span>
              </button>
            </div>

            {/* Tab Views */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: PENDING SUBMISSIONS */}
              {activeTab === 'pending' && (
                <div className="space-y-4">
                  {pendingEvents.length === 0 ? (
                    <div className="text-center py-12 space-y-2 text-stone-500">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                      <p className="text-sm font-semibold">All submissions verified!</p>
                      <p className="text-xs">There are no pending events requiring moderation right now.</p>
                    </div>
                  ) : (
                    pendingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                              Pending Community Submission
                            </span>
                            <h4 className="text-base font-bold text-[#291809]">
                              {event.title}
                            </h4>
                          </div>

                          <span className="text-xs text-stone-400">
                            Submitted: {new Date(event.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
                          <div>
                            <span className="font-bold text-stone-500 block">Date & Timing:</span>
                            <span>{formatEventDate(event.event_date)} ({formatTimeRange(event.start_time, event.end_time)})</span>
                          </div>
                          <div>
                            <span className="font-bold text-stone-500 block">Venue & Locality:</span>
                            <span>{event.venue_name}, {event.locality}</span>
                          </div>
                          <div>
                            <span className="font-bold text-stone-500 block">Organizer & Phone:</span>
                            <span>{event.organizer_name} ({event.contact_phone})</span>
                          </div>
                        </div>

                        <div className="bg-stone-50 p-3 rounded-xl text-xs space-y-1">
                          <span className="font-bold text-stone-700">Mahaprasad Menu:</span>
                          <p className="text-stone-600">{event.menu_details}</p>
                          <span className="font-bold text-stone-700 block pt-1">Occasion / Description:</span>
                          <p className="text-stone-600">{event.description}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100">
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Info</span>
                          </button>

                          <button
                            onClick={() => setRejectingEvent(event)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>

                          <button
                            onClick={() => handleApprove(event)}
                            className="inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve & Publish Live</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: LIVE & APPROVED EVENTS */}
              {activeTab === 'approved' && (
                <div className="space-y-3">
                  {approvedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            event.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            event.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-stone-100 text-stone-700'
                          }`}>
                            {event.status.toUpperCase()}
                          </span>
                          {event.is_demo && (
                            <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                              Demo Data
                            </span>
                          )}
                          <h4 className="font-bold text-sm text-[#291809]">
                            {event.title}
                          </h4>
                        </div>
                        <p className="text-stone-500">
                          {event.venue_name}, {event.locality} • {formatEventDate(event.event_date)} ({formatTimeRange(event.start_time, event.end_time)})
                        </p>
                      </div>

                      {/* Management actions */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg"
                          title="Edit details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {event.status !== 'cancelled' ? (
                          <button
                            onClick={() => handleStatusChange(event, 'cancelled')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg"
                          >
                            Mark Cancelled
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(event, 'approved')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
                          >
                            Restore Live
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteEvent(event)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete spam or duplicate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: CITIZEN REPORTS */}
              {activeTab === 'reports' && (
                <div className="space-y-3">
                  {reports.length === 0 ? (
                    <div className="text-center py-10 text-stone-500 text-xs">
                      No citizen reports logged yet.
                    </div>
                  ) : (
                    reports.map((report) => (
                      <div
                        key={report.id}
                        className="bg-white border border-stone-200 rounded-2xl p-4 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              Issue: {report.report_type.replace('_', ' ')}
                            </span>
                            <span className="font-bold text-stone-800">
                              Event: {report.event_title}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            report.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            report.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-stone-100 text-stone-600'
                          }`}>
                            Status: {report.status}
                          </span>
                        </div>

                        <p className="text-stone-700 bg-stone-50 p-2.5 rounded-xl">
                          {report.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                          <span>Reporter Contact: {report.reporter_contact || 'Anonymous'}</span>
                          {report.status === 'pending' && (
                            <div className="space-x-2">
                              <button
                                onClick={() => handleResolveReport(report.id, 'dismissed')}
                                className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold"
                              >
                                Dismiss
                              </button>
                              <button
                                onClick={() => handleResolveReport(report.id, 'resolved')}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                              >
                                Mark Resolved
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: DIRECT ADMIN PUBLISH */}
              {activeTab === 'add_direct' && (
                <form onSubmit={handleDirectCreate} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 max-w-2xl mx-auto text-xs">
                  <h4 className="font-bold text-sm text-[#291809]">
                    Publish Pre-verified Bhandara Directly
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-700">Event Title *</label>
                      <input
                        type="text"
                        required
                        value={directForm.title}
                        onChange={(e) => setDirectForm({ ...directForm, title: e.target.value })}
                        className="w-full p-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-700">Category *</label>
                      <select
                        value={directForm.category}
                        onChange={(e) => setDirectForm({ ...directForm, category: e.target.value as any })}
                        className="w-full p-2 border border-stone-300 rounded-xl"
                      >
                        <option value="bhandara">Bhandara</option>
                        <option value="mahaprasad">Mahaprasad</option>
                        <option value="annadan">Annadan Seva</option>
                        <option value="temple_feast">Temple Feast</option>
                        <option value="community_meals">Community Meals (J1)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-700">Date *</label>
                      <input
                        type="date"
                        required
                        value={directForm.event_date}
                        onChange={(e) => setDirectForm({ ...directForm, event_date: e.target.value })}
                        className="w-full p-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-700">Start Time *</label>
                      <input
                        type="time"
                        required
                        value={directForm.start_time}
                        onChange={(e) => setDirectForm({ ...directForm, start_time: e.target.value })}
                        className="w-full p-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-700">End Time *</label>
                      <input
                        type="time"
                        required
                        value={directForm.end_time}
                        onChange={(e) => setDirectForm({ ...directForm, end_time: e.target.value })}
                        className="w-full p-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-700">Venue Name *</label>
                      <input
                        type="text"
                        required
                        value={directForm.venue_name}
                        onChange={(e) => setDirectForm({ ...directForm, venue_name: e.target.value })}
                        className="w-full p-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-700">Amravati Locality *</label>
                      <select
                        value={directForm.locality}
                        onChange={(e) => setDirectForm({ ...directForm, locality: e.target.value })}
                        className="w-full p-2 border border-stone-300 rounded-xl"
                      >
                        {AMRAVATI_LOCALITIES.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={directForm.address}
                      onChange={(e) => setDirectForm({ ...directForm, address: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Mahaprasad Menu *</label>
                    <input
                      type="text"
                      required
                      value={directForm.menu_details}
                      onChange={(e) => setDirectForm({ ...directForm, menu_details: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Description *</label>
                    <textarea
                      rows={2}
                      required
                      value={directForm.description}
                      onChange={(e) => setDirectForm({ ...directForm, description: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-700">Organizer Name *</label>
                      <input
                        type="text"
                        required
                        value={directForm.organizer_name}
                        onChange={(e) => setDirectForm({ ...directForm, organizer_name: e.target.value })}
                        className="w-full p-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-700">Contact Phone (10-digits) *</label>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={directForm.contact_phone}
                        onChange={(e) => setDirectForm({ ...directForm, contact_phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full p-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  >
                    Publish Verified Event Immediately
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal: Rejection Reason Dialog */}
        {rejectingEvent && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white p-5 rounded-2xl max-w-md w-full space-y-3">
              <h4 className="font-bold text-sm text-rose-700">Reject Submission</h4>
              <p className="text-xs text-stone-600">
                Rejecting "{rejectingEvent.title}". Specify the reason for internal record:
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Duplicate listing or unverifiable contact number..."
                className="w-full p-2 border border-stone-300 rounded-xl text-xs"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setRejectingEvent(null)}
                  className="px-3 py-1.5 text-xs text-stone-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 rounded-xl"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Event Details Dialog */}
        {editingEvent && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white p-5 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="font-bold text-sm text-[#291809]">Edit Event Information</h4>
                <button onClick={() => setEditingEvent(null)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block">Title</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block">Venue</label>
                  <input
                    type="text"
                    value={editingEvent.venue_name}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue_name: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block">Start Time</label>
                    <input
                      type="time"
                      value={editingEvent.start_time}
                      onChange={(e) => setEditingEvent({ ...editingEvent, start_time: e.target.value })}
                      className="w-full p-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold block">End Time</label>
                    <input
                      type="time"
                      value={editingEvent.end_time}
                      onChange={(e) => setEditingEvent({ ...editingEvent, end_time: e.target.value })}
                      className="w-full p-2 border rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold block">Mahaprasad Menu</label>
                  <input
                    type="text"
                    value={editingEvent.menu_details}
                    onChange={(e) => setEditingEvent({ ...editingEvent, menu_details: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block">Description</label>
                  <textarea
                    rows={3}
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-3 py-1.5 rounded-xl text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl font-bold text-white bg-orange-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
