// src/services/problem.service.ts
import { Problem, ProblemStatus, Alert, Category, StatusHistoryItem, SupportingReport } from '../types';
import { PROBLEM_CATEGORIES, DEPARTMENTS, INITIAL_PROBLEMS } from '../constants/categories';
import { generateAICostAnalysis } from './aiCost.service';
import { realtimeService } from './realtime.service';
import { calculateDistanceKm } from '../utils/formatters';

const STORAGE_KEY = 'janmitra_problems_data';
const ALERTS_KEY = 'janmitra_alerts_data';
const VOTES_KEY = 'janmitra_user_votes';

export interface CreateProblemInput {
  category: Category;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  priority_level?: 'low' | 'medium' | 'high' | 'critical';
  language_code?: 'en' | 'hi' | 'mr';
  user: {
    id: string;
    name: string;
    avatar_url?: string;
    phone?: string;
  };
}

class ProblemService {
  private problemsCache: Problem[] = [];
  private changeSubscribers: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    this.problemsCache = this.getStoredProblems();

    // Fetch initial list from server to ensure perfect sync across devices
    this.fetchFromServer();

    // Subscribe to incoming WebSocket / Broadcast real-time events
    realtimeService.subscribe((event) => {
      if (event.type === 'init' && Array.isArray(event.problems)) {
        this.problemsCache = event.problems;
        this.saveProblems(this.problemsCache);
        this.notifyChange();
      } else if (event.type === 'problem:created' && event.problem) {
        // Guard against duplicate: check if exists
        const exists = this.problemsCache.some((p) => p.id === event.problem.id);
        if (!exists) {
          this.problemsCache.unshift(event.problem);
          this.saveProblems(this.problemsCache);

          // Add notification alert
          const alerts = this.getStoredAlerts();
          alerts.unshift({
            id: `alt-${Date.now()}`,
            user_id: 'all',
            title: `New Issue Reported: ${event.problem.category.toUpperCase()}`,
            message: `"${event.problem.title.slice(0, 45)}..." was just posted by ${event.problem.user.name}.`,
            type: 'new_problem',
            problem_id: event.problem.id,
            problem_title: event.problem.title,
            read: false,
            created_at: new Date().toISOString(),
          });
          this.saveAlerts(alerts);
          this.notifyChange();
        }
      } else if (event.type === 'problem:voted') {
        const target = this.problemsCache.find((p) => p.id === event.problemId);
        if (target) {
          target.upvotes = event.upvotes;
          target.downvotes = event.downvotes;
          this.saveProblems(this.problemsCache);
          this.notifyChange();
        }
      } else if (event.type === 'problem:hyped') {
        const target = this.problemsCache.find((p) => p.id === event.problemId);
        if (target) {
          target.hype_score = event.hype_score;
          target.hypeCount = event.hype_score;
          if (event.hyped_by) target.hyped_by = event.hyped_by;
          if (event.supporting_reports) target.supporting_reports = event.supporting_reports;
          this.saveProblems(this.problemsCache);
          this.notifyChange();
        }
      } else if (event.type === 'problem:status_updated' && event.problem) {
        const idx = this.problemsCache.findIndex((p) => p.id === event.problem.id);
        if (idx !== -1) {
          this.problemsCache[idx] = event.problem;
          this.saveProblems(this.problemsCache);

          const alerts = this.getStoredAlerts();
          alerts.unshift({
            id: `alt-${Date.now()}`,
            user_id: event.problem.user_id,
            title: `Status Updated: ${event.problem.status.toUpperCase()}`,
            message: `Official update by ${event.officerName || 'Officer'}: "${event.problem.title.slice(0, 40)}..."`,
            type: 'status_update',
            problem_id: event.problem.id,
            problem_title: event.problem.title,
            read: false,
            created_at: new Date().toISOString(),
          });
          this.saveAlerts(alerts);
          this.notifyChange();
        }
      } else if (event.type === 'problem:comment_added' && event.comment) {
        const target = this.problemsCache.find((p) => p.id === event.problemId);
        if (target) {
          if (!target.comments) target.comments = [];
          target.comments.push(event.comment);
          this.saveProblems(this.problemsCache);
          this.notifyChange();
        }
      }
    });
  }

  public subscribeToChanges(cb: () => void): () => void {
    this.changeSubscribers.add(cb);
    return () => {
      this.changeSubscribers.delete(cb);
    };
  }

  private notifyChange() {
    this.changeSubscribers.forEach((cb) => {
      try {
        cb();
      } catch {}
    });
  }

  private async fetchFromServer() {
    try {
      const res = await fetch('/api/v1/problems');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          this.problemsCache = json.data;
          this.saveProblems(this.problemsCache);
          this.notifyChange();
        }
      }
    } catch {}
  }

  private getStoredProblems(): Problem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [...INITIAL_PROBLEMS];
  }

  private saveProblems(problems: Problem[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    } catch {}
  }

  public getStoredAlerts(): Alert[] {
    try {
      const data = localStorage.getItem(ALERTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [];
  }

  private saveAlerts(alerts: Alert[]) {
    try {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
    } catch {}
  }

  public getAll(params?: {
    category?: string;
    status?: string;
    search?: string;
    sortBy?: 'newest' | 'nearest' | 'trending' | 'most_hyped';
    userLat?: number;
    userLng?: number;
  }): Problem[] {
    let list = [...this.problemsCache];

    if (params?.category && params.category !== 'all') {
      list = list.filter((p) => p.category === params.category);
    }

    if (params?.status && params.status !== 'all') {
      list = list.filter((p) => p.status === params.status || p.complaint_status === params.status);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    if (params?.sortBy === 'most_hyped') {
      list.sort((a, b) => (b.hype_score ?? b.upvotes ?? 0) - (a.hype_score ?? a.upvotes ?? 0));
    } else if (params?.sortBy === 'trending') {
      list.sort((a, b) => ((b.hype_score || 0) * 3 + b.upvotes * 2 + (b.views || 0)) - ((a.hype_score || 0) * 3 + a.upvotes * 2 + (a.views || 0)));
    } else if (params?.sortBy === 'nearest' && params.userLat && params.userLng) {
      const uLat = params.userLat;
      const uLng = params.userLng;
      list.sort((a, b) => {
        const distA = Math.hypot(a.latitude - uLat, a.longitude - uLng);
        const distB = Math.hypot(b.latitude - uLat, b.longitude - uLng);
        return distA - distB;
      });
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }

  public getById(id: string): Problem | undefined {
    return this.problemsCache.find((p) => p.id === id);
  }

  public findNearbyDuplicates(
    category: Category,
    latitude: number,
    longitude: number,
    radiusKm: number = 0.35
  ): { problem: Problem; distanceMeters: number }[] {
    return this.problemsCache
      .filter((p) => {
        if (p.status === 'solved' || p.complaint_status === 'resolved') return false;
        if (p.category !== category) return false;
        const distKm = calculateDistanceKm(p.latitude, p.longitude, latitude, longitude);
        return distKm <= radiusKm;
      })
      .map((p) => {
        const distKm = calculateDistanceKm(p.latitude, p.longitude, latitude, longitude);
        return {
          problem: p,
          distanceMeters: Math.round(distKm * 1000),
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }

  public isHypedByUser(problemId: string, userId: string): boolean {
    const problem = this.problemsCache.find((p) => p.id === problemId);
    if (!problem || !problem.hyped_by) return false;
    return problem.hyped_by.includes(userId);
  }

  public hype(
    problemId: string,
    user: { id: string; name: string; avatar_url?: string },
    note?: string,
    image?: string
  ): { hypeScore: number; hype_score: number; isHyped: boolean; supporting_reports: SupportingReport[] } {
    const problem = this.problemsCache.find((p) => p.id === problemId);
    if (!problem) {
      return { hypeScore: 0, hype_score: 0, isHyped: false, supporting_reports: [] };
    }

    if (!problem.hyped_by) problem.hyped_by = [];
    if (problem.hype_score === undefined || problem.hype_score === null) {
      problem.hype_score = problem.upvotes || 1;
    }
    if (!problem.supporting_reports) problem.supporting_reports = [];

    let isHyped = problem.hyped_by.includes(user.id);

    // If confirmation notes or image are attached, this is a full supporting report
    if (note || image) {
      const newReport: SupportingReport = {
        id: `sr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        problem_id: problemId,
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatar_url,
        notes: note,
        image: image,
        created_at: new Date().toISOString(),
      };
      problem.supporting_reports.unshift(newReport);

      if (!isHyped) {
        problem.hyped_by.push(user.id);
        problem.hype_score += 1;
        isHyped = true;
      } else {
        problem.hype_score += 1;
      }
    } else {
      // Toggle hype
      if (isHyped) {
        problem.hyped_by = problem.hyped_by.filter((uid) => uid !== user.id);
        problem.hype_score = Math.max(0, problem.hype_score - 1);
        isHyped = false;
      } else {
        problem.hyped_by.push(user.id);
        problem.hype_score += 1;
        isHyped = true;
      }
    }

    problem.hypeCount = problem.hype_score;
    this.saveProblems(this.problemsCache);
    this.notifyChange();

    realtimeService.broadcastLocally({
      type: 'problem:hyped',
      problemId,
      hype_score: problem.hype_score,
      hyped_by: problem.hyped_by,
      supporting_reports: problem.supporting_reports,
      userId: user.id,
      userName: user.name,
    });

    fetch(`/api/v1/problems/${problemId}/hype`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, user, note, image }),
    }).catch(() => {});

    return {
      hypeScore: problem.hype_score,
      hype_score: problem.hype_score,
      isHyped,
      supporting_reports: problem.supporting_reports,
    };
  }

  public create(input: CreateProblemInput): Problem {
    const priority = input.priority_level || 'medium';
    const departmentObj = DEPARTMENTS.find((d) => d.category === input.category) || DEPARTMENTS[0];
    const aiCost = generateAICostAnalysis(input.category, input.title, input.description, priority);

    const now = new Date().toISOString();
    const newProblemId = `prob-real-${Date.now().toString().slice(-6)}`;

    const newProblem: Problem = {
      id: newProblemId,
      user_id: input.user.id,
      category: input.category,
      title: input.title,
      description: input.description,
      address: input.address,
      latitude: input.latitude,
      longitude: input.longitude,
      images: input.images.length > 0 ? input.images : [
        'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80'
      ],
      status: 'posted',
      complaint_status: 'submitted',
      language_code: input.language_code || 'en',
      department_id: departmentObj.id,
      department_name: departmentObj.name,
      priority_level: priority,
      urgency: priority,
      created_at: now,
      updated_at: now,
      upvotes: 1,
      downvotes: 0,
      views: 1,
      hype_score: 1,
      hypeCount: 1,
      hyped_by: [input.user.id],
      supporting_reports: [],
      trending_score: 50,
      impact_score: 60,
      affected_people: priority === 'critical' ? 5000 : 800,
      estimated_cost_min: aiCost.estimatedCost.min,
      estimated_cost_max: aiCost.estimatedCost.max,
      cost_analysis: aiCost,
      user: input.user,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: 'submitted',
          label: 'Complaint Submitted',
          changed_by: input.user.name,
          role: 'Citizen',
          notes: 'Civic issue filed with photo and verified GPS.',
          timestamp: now,
        },
      ],
      comments: [],
    };

    // Optimistic update
    this.problemsCache.unshift(newProblem);
    this.saveProblems(this.problemsCache);
    this.notifyChange();

    // Broadcast locally to any open tab
    realtimeService.broadcastLocally({
      type: 'problem:created',
      problem: newProblem,
      author: input.user.name,
    });

    // Send to backend server for multi-device sync
    fetch('/api/v1/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProblem),
    }).catch((e) => console.warn('Backend sync note:', e));

    return newProblem;
  }

  public upvote(problemId: string, userId: string): { upvotes: number; downvotes: number; userVote: 'upvote' | null } {
    const problem = this.problemsCache.find((p) => p.id === problemId);
    if (!problem) return { upvotes: 0, downvotes: 0, userVote: null };

    const votes = this.getUserVotes();
    const voteKey = `${userId}_${problemId}`;
    const previous = votes[voteKey];

    let userVote: 'upvote' | null = 'upvote';

    if (previous === 'upvote') {
      problem.upvotes = Math.max(0, problem.upvotes - 1);
      delete votes[voteKey];
      userVote = null;
    } else {
      if (previous === 'downvote') {
        problem.downvotes = Math.max(0, problem.downvotes - 1);
      }
      problem.upvotes += 1;
      votes[voteKey] = 'upvote';
    }

    this.saveUserVotes(votes);
    this.saveProblems(this.problemsCache);
    this.notifyChange();

    // Broadcast real-time
    realtimeService.broadcastLocally({
      type: 'problem:voted',
      problemId,
      upvotes: problem.upvotes,
      downvotes: problem.downvotes,
      votedBy: userId,
    });

    // Backend call
    fetch(`/api/v1/problems/${problemId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, voteType: 'upvote' }),
    }).catch(() => {});

    return { upvotes: problem.upvotes, downvotes: problem.downvotes, userVote };
  }

  public downvote(problemId: string, userId: string): { upvotes: number; downvotes: number; userVote: 'downvote' | null } {
    const problem = this.problemsCache.find((p) => p.id === problemId);
    if (!problem) return { upvotes: 0, downvotes: 0, userVote: null };

    const votes = this.getUserVotes();
    const voteKey = `${userId}_${problemId}`;
    const previous = votes[voteKey];

    let userVote: 'downvote' | null = 'downvote';

    if (previous === 'downvote') {
      problem.downvotes = Math.max(0, problem.downvotes - 1);
      delete votes[voteKey];
      userVote = null;
    } else {
      if (previous === 'upvote') {
        problem.upvotes = Math.max(0, problem.upvotes - 1);
      }
      problem.downvotes += 1;
      votes[voteKey] = 'downvote';
    }

    this.saveUserVotes(votes);
    this.saveProblems(this.problemsCache);
    this.notifyChange();

    realtimeService.broadcastLocally({
      type: 'problem:voted',
      problemId,
      upvotes: problem.upvotes,
      downvotes: problem.downvotes,
      votedBy: userId,
    });

    fetch(`/api/v1/problems/${problemId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, voteType: 'downvote' }),
    }).catch(() => {});

    return { upvotes: problem.upvotes, downvotes: problem.downvotes, userVote };
  }

  public getUserVote(problemId: string, userId: string): 'upvote' | 'downvote' | null {
    const votes = this.getUserVotes();
    return votes[`${userId}_${problemId}`] || null;
  }

  private getUserVotes(): Record<string, 'upvote' | 'downvote'> {
    try {
      const data = localStorage.getItem(VOTES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveUserVotes(votes: Record<string, 'upvote' | 'downvote'>) {
    try {
      localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
    } catch {}
  }

  public updateStatus(
    problemId: string,
    status: ProblemStatus,
    notes?: string,
    proofImage?: string,
    officerName: string = 'Er. Rajesh Kulkarni'
  ): Problem | undefined {
    const problem = this.problemsCache.find((p) => p.id === problemId);
    if (!problem) return undefined;

    const now = new Date().toISOString();
    problem.status = status;
    problem.updated_at = now;

    if (status === 'solved') {
      problem.complaint_status = 'resolved';
      problem.resolved_at = now;
      problem.resolved_by = officerName;
      if (notes) problem.resolution_notes = notes;
      if (proofImage) problem.solved_image = proofImage;
    } else if (status === 'being_helped') {
      problem.complaint_status = 'assigned';
    } else if (status === 'in_progress') {
      problem.complaint_status = 'in_progress';
    } else if (status === 'escalated') {
      problem.complaint_status = 'escalated';
    }

    if (!problem.timeline) problem.timeline = [];
    problem.timeline.push({
      id: `tl-${Date.now()}`,
      status: (problem.complaint_status || status) as any,
      label: status === 'solved' ? 'Resolved & Verified' : status === 'in_progress' ? 'Work In Progress' : 'Status Updated',
      changed_by: officerName,
      role: 'Municipal Officer',
      notes: notes || 'Updated via JanMitra Municipal Desk.',
      timestamp: now,
      proof_image: proofImage,
    });

    this.saveProblems(this.problemsCache);
    this.notifyChange();

    realtimeService.broadcastLocally({
      type: 'problem:status_updated',
      problem,
      officerName,
    });

    fetch(`/api/v1/problems/${problemId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes, proofImage, officerName }),
    }).catch(() => {});

    return problem;
  }

  public addComment(problemId: string, text: string, user: { id: string; name: string; role: any }): Problem | undefined {
    const problem = this.problemsCache.find((p) => p.id === problemId);
    if (!problem) return undefined;

    if (!problem.comments) problem.comments = [];
    const newComment = {
      id: `comm-${Date.now()}`,
      problem_id: problemId,
      user_id: user.id,
      user_name: user.name,
      user_role: user.role,
      text,
      created_at: new Date().toISOString(),
    };

    problem.comments.push(newComment);
    this.saveProblems(this.problemsCache);
    this.notifyChange();

    realtimeService.broadcastLocally({
      type: 'problem:comment_added',
      problemId,
      comment: newComment,
    });

    fetch(`/api/v1/problems/${problemId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, user }),
    }).catch(() => {});

    return problem;
  }

  public markAlertRead(alertId: string) {
    const alerts = this.getStoredAlerts();
    const target = alerts.find((a) => a.id === alertId);
    if (target) {
      target.read = true;
      this.saveAlerts(alerts);
    }
  }

  public markAllAlertsRead() {
    const alerts = this.getStoredAlerts();
    alerts.forEach((a) => (a.read = true));
    this.saveAlerts(alerts);
  }

  public getOfficerStats() {
    const total = this.problemsCache.length;
    const submitted = this.problemsCache.filter((p) => p.status === 'posted').length;
    const inReview = this.problemsCache.filter((p) => p.status === 'being_helped').length;
    const inProgress = this.problemsCache.filter((p) => p.status === 'in_progress').length;
    const resolved = this.problemsCache.filter((p) => p.status === 'solved').length;
    const critical = this.problemsCache.filter((p) => p.priority_level === 'critical').length;
    const totalUpvotes = this.problemsCache.reduce((acc, p) => acc + p.upvotes, 0);

    return {
      total,
      submitted,
      inReview,
      inProgress,
      resolved,
      critical,
      totalUpvotes,
      avgResolutionHours: 28.4,
      slaComplianceRate: 94.2,
    };
  }
}

export const problemService = new ProblemService();
