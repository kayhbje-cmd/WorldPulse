// src/pages/ProblemDetails.tsx
import React, { useState } from 'react';
import { Problem, ProblemStatus } from '../types';
import { PROBLEM_CATEGORIES } from '../constants/categories';
import { problemService } from '../services/problem.service';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ComplaintStatusBadge } from '../components/ComplaintStatusBadge';
import { ComplaintTimeline } from '../components/ComplaintTimeline';
import { VoteButton } from '../components/VoteButton';
import { ImageLightboxModal } from '../components/ImageLightboxModal';
import { formatTimeAgo, formatCurrencyINR } from '../utils/formatters';
import { 
  ArrowLeft, 
  MapPin, 
  Share2, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle,
  Eye,
  CheckCircle2,
  Send,
  Wrench,
  Camera,
  Layers,
  Clock,
  Flame,
  Users,
  Plus
} from 'lucide-react';
import { HypeBadge } from '../components/HypeBadge';
import { HypeButton } from '../components/HypeButton';

interface Props {
  problemId: string;
  onBack: () => void;
  onNavigateToMap: () => void;
  onOpenChat: (problem: Problem) => void;
}

export const ProblemDetails: React.FC<Props> = ({
  problemId,
  onBack,
  onNavigateToMap,
  onOpenChat,
}) => {
  const { user, isOfficer } = useAuth();
  const { language, t, getCategoryName } = useLanguage();

  const [problem, setProblem] = useState<Problem | undefined>(() =>
    problemService.getById(problemId)
  );

  // Subscribe to real-time updates so live hypes & confirmations appear immediately
  React.useEffect(() => {
    const unsub = problemService.subscribeToChanges(() => {
      const latest = problemService.getById(problemId);
      if (latest) {
        setProblem({ ...latest });
      }
    });
    return () => unsub();
  }, [problemId]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Comment input
  const [commentText, setCommentText] = useState('');

  // Witness / Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [confirmPhoto, setConfirmPhoto] = useState('');

  // Officer Update Modal
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ProblemStatus>(problem?.status || 'in_progress');
  const [officerNotes, setOfficerNotes] = useState('');
  const [resolutionProofPhoto, setResolutionProofPhoto] = useState(
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80'
  );

  if (!problem) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <h2 className="text-base font-bold text-gray-800">Complaint Not Found</h2>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const categoryObj = PROBLEM_CATEGORIES.find((c) => c.id === problem.category);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `JanMitra Issue: ${problem.title}`,
        text: `${problem.title} at ${problem.address}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const updated = problemService.addComment(problem.id, commentText.trim(), {
      id: user?.id || 'usr-1',
      name: user?.name || 'Aarav Sharma',
      role: user?.role || 'citizen',
    });
    if (updated) {
      setProblem({ ...updated });
      setCommentText('');
    }
  };

  const handleOfficerStatusUpdate = () => {
    const updated = problemService.updateStatus(
      problem.id,
      newStatus,
      officerNotes,
      newStatus === 'solved' ? resolutionProofPhoto : undefined,
      user?.name || 'Er. Rajesh Kulkarni'
    );
    if (updated) {
      setProblem({ ...updated });
      setShowOfficerModal(false);
      setOfficerNotes('');
    }
  };

  const handleAddConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmNotes.trim() && !confirmPhoto) return;

    problemService.hype(
      problem.id,
      {
        id: user?.id || 'usr-1',
        name: user?.name || 'Citizen',
        avatar_url: user?.avatar_url,
      },
      confirmNotes.trim() || 'Citizen witnessed and confirmed this issue.',
      confirmPhoto || undefined
    );

    const updated = problemService.getById(problem.id);
    if (updated) {
      setProblem({ ...updated });
    }
    setShowConfirmModal(false);
    setConfirmNotes('');
    setConfirmPhoto('');
  };

  return (
    <div className="pb-28 pt-2 max-w-3xl mx-auto px-4 space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold shadow-2xs cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-emerald-700 hover:bg-gray-50 text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 1. Image Carousel & Lightbox */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-md">
        <div
          onClick={() => setLightboxImage(problem.images[activeImageIndex] || problem.images[0])}
          className="cursor-zoom-in relative h-72 sm:h-96 w-full"
        >
          <img
            src={problem.images[activeImageIndex] || problem.images[0]}
            alt={problem.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Image thumbnails if multiple */}
        {problem.images.length > 1 && (
          <div className="absolute bottom-3 left-4 flex gap-2 z-10">
            {problem.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition ${
                  activeImageIndex === i ? 'border-emerald-400 scale-105' : 'border-white/50 opacity-70'
                }`}
              >
                <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Category & Status Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap max-w-[70%]">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
            style={{ backgroundColor: categoryObj?.color || '#16A34A' }}
          >
            <span>{categoryObj?.emoji}</span>
            <span>{getCategoryName(problem.category)}</span>
          </span>
          <ComplaintStatusBadge status={problem.status} size="sm" />
        </div>

        {/* Hype & Upvote Pills on Image */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-xs rounded-2xl p-1 shadow-sm">
          <HypeButton
            problemId={problem.id}
            initialHype={problem.hype_score}
            hypedBy={problem.hyped_by}
            size="sm"
            onHypeSuccess={(score) => {
              setProblem(prev => prev ? { ...prev, hype_score: score, hypeCount: score } : prev);
            }}
          />
          <VoteButton
            problemId={problem.id}
            initialUpvotes={problem.upvotes}
            initialDownvotes={problem.downvotes}
            size="sm"
          />
        </div>
      </div>

      {/* Community Hype & Priority Card */}
      <div className="bg-linear-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-2 border-orange-200/90 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <HypeBadge score={problem.hype_score} size="md" />
            <span className="text-xs font-black text-orange-950 uppercase tracking-wider">
              Community Priority
            </span>
          </div>
          <p className="text-xs text-orange-950/80 leading-relaxed max-w-md">
            🔥 <strong>Hype represents citizen confirmations & attention.</strong> The higher the hype, the higher this issue ranks for immediate municipal intervention.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <HypeButton
            problemId={problem.id}
            initialHype={problem.hype_score}
            hypedBy={problem.hyped_by}
            size="md"
            onHypeSuccess={(score) => {
              setProblem((prev) => (prev ? { ...prev, hype_score: score, hypeCount: score } : prev));
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Users size={14} />
            <span>I Witnessed This (+1)</span>
          </button>
        </div>
      </div>

      {/* 2. Main Complaint Header & User Meta */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
            <span className="font-bold text-emerald-800 uppercase tracking-wider">
              Ticket #{problem.id}
            </span>
            <span>•</span>
            <span>{formatTimeAgo(problem.created_at)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye size={12} /> {problem.views || 1} views
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
            {problem.title}
          </h1>
        </div>

        {/* Location Row */}
        <div
          onClick={onNavigateToMap}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-200/80 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MapPin size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{problem.address}</p>
            <p className="text-[11px] text-emerald-700 font-semibold">
              Ward Coordinates: {problem.latitude.toFixed(4)}, {problem.longitude.toFixed(4)} (Tap to view on map)
            </p>
          </div>
        </div>

        {/* Reporter info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <img
              src={problem.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={problem.user?.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p className="text-xs font-bold text-gray-900">{problem.user?.name || 'Citizen'}</p>
              <p className="text-[10px] text-gray-400">Citizen Reporter</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              Priority: {problem.priority_level?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Full Description */}
        <div className="pt-3 border-t border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Citizen Statement
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {problem.description}
          </p>
        </div>
      </div>

      {/* Officer Quick Action Bar (if Officer mode or testing) */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">
            Municipal Action Desk
          </span>
          <h3 className="text-sm font-bold mt-1">Responsible Desk: {problem.department_name || 'PWD & Civic Services'}</h3>
          <p className="text-xs text-blue-100 mt-0.5">
            Officer in charge: {problem.assigned_officer_name || 'Er. Rajesh Kulkarni'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenChat(problem)}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <MessageSquare size={14} />
            <span>Chat Desk</span>
          </button>

          <button
            onClick={() => setShowOfficerModal(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Wrench size={14} />
            <span>Update Status</span>
          </button>
        </div>
      </div>

      {/* 3. Official Status Timeline */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Clock size={16} className="text-emerald-600" />
          <span>{t('officialTimeline', 'Official Municipal Action Timeline')}</span>
        </h3>

        <ComplaintTimeline
          currentStatus={problem.status}
          timeline={problem.timeline}
          resolutionNotes={problem.resolution_notes}
          solvedImage={problem.solved_image}
        />
      </div>

      {/* 4. AI Civic Cost & Work Analysis Card */}
      {problem.cost_analysis && (
        <div className="bg-linear-to-br from-emerald-50/70 via-teal-50/40 to-white rounded-3xl p-5 border border-emerald-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  {t('aiAnalysisTitle', 'AI Civic Cost & Work Analysis')}
                </h3>
                <p className="text-[11px] text-emerald-700">Projected Remediation Requirements</p>
              </div>
            </div>

            <span className="text-xs font-black text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-200">
              {formatCurrencyINR(problem.cost_analysis.estimatedCost.min)} -{' '}
              {formatCurrencyINR(problem.cost_analysis.estimatedCost.max)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Completion ETA
              </span>
              <span className="text-xs font-bold text-gray-800 mt-0.5 block">
                {problem.cost_analysis.timeToComplete}
              </span>
            </div>
            <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Workforce Deployment
              </span>
              <span className="text-xs font-bold text-gray-800 mt-0.5 block line-clamp-1">
                {problem.cost_analysis.laborRequired.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Materials List */}
          <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
              Prescribed Civil Materials:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-700">
              {problem.cost_analysis.materialsNeeded.map((mat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{mat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Recommendations */}
          <div className="bg-emerald-100/50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
            <span className="font-bold block mb-1">Standard Operating Procedure:</span>
            <p className="text-emerald-800 leading-relaxed">
              {problem.cost_analysis.recommendations}
            </p>
          </div>
        </div>
      )}

      {/* 4b. Citizen Eyewitness Confirmations & Supporting Reports */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <Flame size={18} className="fill-orange-500 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>Citizen Confirmations & Evidence</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                  {problem.supporting_reports?.length || 0}
                </span>
              </h3>
              <p className="text-[11px] text-gray-500">
                Eyewitness statements and location photos supporting this civic issue
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Confirmation</span>
          </button>
        </div>

        {problem.supporting_reports && problem.supporting_reports.length > 0 ? (
          <div className="space-y-3">
            {problem.supporting_reports.map((report) => (
              <div
                key={report.id}
                className="p-3.5 bg-orange-50/40 rounded-2xl border border-orange-100/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white font-bold text-[10px] flex items-center justify-center shadow-2xs">
                      {report.user_name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{report.user_name}</span>
                      <span className="text-[10px] text-orange-800 font-medium">Verified Citizen Witness</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {formatTimeAgo(report.created_at)}
                  </span>
                </div>

                {report.notes && (
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    "{report.notes}"
                  </p>
                )}

                {report.image && (
                  <div
                    onClick={() => setLightboxImage(report.image!)}
                    className="relative w-32 h-20 rounded-xl overflow-hidden border border-orange-200 cursor-zoom-in group"
                  >
                    <img
                      src={report.image}
                      alt="Witness verification proof"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                      Tap photo
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-2">
            <p className="text-xs text-gray-500 font-medium">
              No additional eyewitness confirmations attached yet.
            </p>
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="text-xs text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
            >
              Have you witnessed this problem? Add your confirmation to raise urgency
            </button>
          </div>
        )}
      </div>

      {/* 5. Citizen & Community Comments */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center justify-between">
          <span>Community Discussion & Eyewitnesses</span>
          <span className="text-xs text-gray-400 font-normal">
            ({problem.comments?.length || 0} remarks)
          </span>
        </h3>

        {/* Existing Comments */}
        <div className="space-y-3">
          {problem.comments && problem.comments.length > 0 ? (
            problem.comments.map((comm) => (
              <div key={comm.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-800">
                  <div className="flex items-center gap-1.5">
                    <span>{comm.user_name}</span>
                    {comm.user_role === 'officer' && (
                      <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-md text-[9px] font-bold">
                        OFFICER
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-normal">
                    {formatTimeAgo(comm.created_at)}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{comm.text}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No community comments yet. Add the first comment below.</p>
          )}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add eyewitness info or update..."
            className="flex-1 bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Send size={13} />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
        title={problem.title}
      />

      {/* Witness / Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Flame size={16} className="text-orange-500 fill-orange-500" />
                  <span>Confirm Issue & Boost Hype</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Adding your witness report increases the issue's Hype Score (+1) and escalates community attention.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddConfirmation} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Eyewitness Notes / Observations
                </label>
                <textarea
                  rows={3}
                  value={confirmNotes}
                  onChange={(e) => setConfirmNotes(e.target.value)}
                  placeholder="e.g. Saw traffic blocked here today; pothole getting deeper after rain."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Optional Photo URL or Proof
                </label>
                <input
                  type="text"
                  value={confirmPhoto}
                  onChange={(e) => setConfirmPhoto(e.target.value)}
                  placeholder="https://... or photo url"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-bold hover:brightness-105 shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Flame size={14} className="fill-white" />
                  <span>Confirm (+1 Hype)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Officer Status Update Modal */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              Update Official Status • Ticket #{problem.id}
            </h3>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Select Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white"
              >
                <option value="posted">⏳ Submitted</option>
                <option value="being_helped">🔍 In Review / Inspection</option>
                <option value="in_progress">🛠️ In Progress / Work Order</option>
                <option value="solved">✅ Resolved / Completed</option>
                <option value="escalated">🚨 Escalated to Higher Authority</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Official Engineering Notes & Remarks
              </label>
              <textarea
                rows={3}
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="e.g., Contractor team finished asphalt overlay. Tested under water run-off."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>

            {newStatus === 'solved' && (
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Resolution Proof Photo URL
                </label>
                <input
                  type="text"
                  value={resolutionProofPhoto}
                  onChange={(e) => setResolutionProofPhoto(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-gray-200 bg-gray-50"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOfficerModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOfficerStatusUpdate}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-xs"
              >
                Commit Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
