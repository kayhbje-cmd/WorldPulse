// server.ts
import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PROBLEMS } from './src/constants/categories';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(express.json({ limit: '15mb' }));

const DATA_FILE = path.join(process.cwd(), '.data_problems.json');

// Predefined 2 Real Personas
export const PREDEFINED_USERS = {
  person1: {
    id: 'usr-avinash',
    email: 'avinashshinde1542@gmail.com',
    name: 'Avinash Shinde',
    phone: '9876543210',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
    role: 'citizen',
    problems_posted: 1,
    problems_solved: 0,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  person2: {
    id: 'usr-officer-rajesh',
    email: 'rajesh.kulkarni@civic.gov.in',
    name: 'Er. Rajesh Kulkarni',
    phone: '9820112345',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    role: 'officer',
    department_id: 'dept-pwd',
    employee_id: 'MCGM-PWD-4091',
    problems_posted: 0,
    problems_solved: 142,
    is_active: true,
    created_at: '2025-06-01T00:00:00.000Z',
  }
};

// Initial Real Civic Issues
const INITIAL_REAL_PROBLEMS = [
  ...INITIAL_PROBLEMS,
  {
    id: 'prob-real-101',
    user_id: 'usr-avinash',
    category: 'infrastructure',
    title: 'Severe crater potholes on SV Road near Bandra Station',
    description: 'Deep potholes spanning over 20 meters across both lanes causing severe traffic jams and two-wheeler skidding risks during rain.',
    address: 'SV Road, Bandra West, Mumbai, Maharashtra 400050',
    latitude: 19.0596,
    longitude: 72.8295,
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'in_progress',
    complaint_status: 'in_progress',
    priority_level: 'critical',
    urgency: 'critical',
    department_id: 'dept-pwd',
    department_name: 'Public Works Department (PWD & Roads)',
    assigned_officer_id: 'usr-officer-rajesh',
    assigned_officer_name: 'Er. Rajesh Kulkarni',
    assigned_officer_designation: 'Executive Engineer (PWD West)',
    assigned_officer_phone: '+91 98201 12345',
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    upvotes: 42,
    downvotes: 0,
    views: 380,
    hype_score: 58,
    hypeCount: 58,
    hyped_by: ['usr-avinash', 'usr-2'],
    supporting_reports: [
      {
        id: 'sr-real-1',
        problem_id: 'prob-real-101',
        user_id: 'usr-2',
        user_name: 'Meera Patil',
        notes: 'Two auto-rickshaws broke suspensions here this morning.',
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      }
    ],
    trending_score: 95,
    impact_score: 90,
    affected_people: 12000,
    estimated_cost_min: 85000,
    estimated_cost_max: 120000,
    cost_analysis: {
      estimatedCost: { min: 85000, max: 120000, currency: 'INR' },
      severity: 'critical',
      urgency: 'critical',
      timeToComplete: '3-4 days',
      materialsNeeded: ['Dense Bituminous Macadam (DBM)', 'Cold Mix Asphalt', 'Tack Coat Emulsion'],
      laborRequired: '6-8 road workers, 1 site supervisor',
      equipmentNeeded: ['Tandem Road Roller', 'Bitumen Sprayer'],
      breakdown: { materials: 55000, labor: 28000, equipment: 22000 },
      factors: ['Heavy traffic route', 'Monsoon rain damage'],
      recommendations: 'Apply waterproof mastic asphalt overlay with rapid setting sealant.'
    },
    user: {
      id: 'usr-avinash',
      name: 'Avinash Shinde',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      phone: '+91 98765 43210'
    },
    timeline: [
      {
        id: 'tl-1',
        status: 'submitted',
        label: 'Complaint Submitted',
        changed_by: 'Avinash Shinde',
        role: 'Citizen',
        notes: 'Photo proof submitted via JanMitra PWA app.',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
      {
        id: 'tl-2',
        status: 'in_progress',
        label: 'Road Repair Work Initiated',
        changed_by: 'Er. Rajesh Kulkarni',
        role: 'Executive Engineer',
        notes: 'Cold mix patch crew mobilized on SV Road.',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      }
    ],
    comments: [
      {
        id: 'comm-1',
        problem_id: 'prob-real-101',
        user_id: 'usr-officer-rajesh',
        user_name: 'Er. Rajesh Kulkarni',
        user_role: 'officer',
        text: 'Inspected the pothole. Work order has been issued to the asphalt contractor.',
        created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'prob-real-102',
    user_id: 'usr-avinash',
    category: 'sanitation',
    title: 'Overflowing community garbage container on FC Road',
    description: 'Waste container overflowing for 2 days near public bus stand attracting stray animals and blocking sidewalk.',
    address: 'FC Road, Shivajinagar, Pune, Maharashtra 411005',
    latitude: 18.5204,
    longitude: 73.8567,
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'being_helped',
    complaint_status: 'assigned',
    priority_level: 'high',
    urgency: 'high',
    department_id: 'dept-swm',
    department_name: 'Solid Waste Management & Sanitation',
    assigned_officer_id: 'usr-officer-rajesh',
    assigned_officer_name: 'Er. Rajesh Kulkarni',
    assigned_officer_designation: 'Ward Officer',
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    upvotes: 28,
    downvotes: 0,
    views: 210,
    hype_score: 35,
    hypeCount: 35,
    hyped_by: ['usr-avinash'],
    supporting_reports: [
      {
        id: 'sr-real-2',
        problem_id: 'prob-real-102',
        user_id: 'usr-3',
        user_name: 'Rohan Joshi',
        notes: 'Overflowing directly onto the pedestrian footpath.',
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      }
    ],
    trending_score: 82,
    impact_score: 75,
    affected_people: 4500,
    estimated_cost_min: 12000,
    estimated_cost_max: 18000,
    cost_analysis: {
      estimatedCost: { min: 12000, max: 18000, currency: 'INR' },
      severity: 'high',
      urgency: 'high',
      timeToComplete: '24 hours',
      materialsNeeded: ['Lime bleaching powder', 'Disinfectant phenyl spray', 'New 1100L bin'],
      laborRequired: '4 sanitation workers',
      equipmentNeeded: ['Hydraulic Compactor Truck'],
      breakdown: { materials: 6000, labor: 5000, equipment: 4000 },
      factors: ['Sidewalk blockage', 'Hygiene risk'],
      recommendations: 'Deploy morning refuse compactor and sanitize ground with bleaching powder.'
    },
    user: {
      id: 'usr-avinash',
      name: 'Avinash Shinde',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
    },
    timeline: [
      {
        id: 'tl-3',
        status: 'submitted',
        label: 'Complaint Submitted',
        changed_by: 'Avinash Shinde',
        role: 'Citizen',
        notes: 'Sanitation report filed.',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      }
    ],
    comments: []
  }
];

// Load persisted state or initialize
let problems: any[] = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    problems = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    // Ensure every problem has hype fields
    problems.forEach((p) => {
      if (p.hype_score === undefined) p.hype_score = p.upvotes || 1;
      if (p.hypeCount === undefined) p.hypeCount = p.hype_score;
      if (!p.hyped_by) p.hyped_by = [];
      if (!p.supporting_reports) p.supporting_reports = [];
    });
  } else {
    problems = [...INITIAL_REAL_PROBLEMS];
    fs.writeFileSync(DATA_FILE, JSON.stringify(problems, null, 2));
  }
} catch {
  problems = [...INITIAL_REAL_PROBLEMS];
}

const userVotes: Record<string, 'upvote' | 'downvote'> = {};

function persistProblems() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(problems, null, 2));
  } catch (err) {
    console.error('Failed to write problems:', err);
  }
}

// Broadcast function to all connected WebSocket clients
function broadcast(payload: any, skipWs?: WebSocket) {
  const msg = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client !== skipWs && client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// WebSocket Connection Management
wss.on('connection', (ws) => {
  // Send initial full state immediately to newly connected client
  ws.send(JSON.stringify({
    type: 'init',
    problems: problems,
    serverTime: new Date().toISOString(),
  }));

  ws.on('message', (messageRaw) => {
    try {
      const data = JSON.parse(messageRaw.toString());
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch {}
  });
});

// REST APIs
// 1. OTP Login Endpoint (OTP: 1234)
app.post('/api/v1/auth/login-otp', (req, res) => {
  const { phone, otp, role, name } = req.body;

  if (otp !== '1234') {
    return res.status(400).json({ success: false, message: 'Invalid OTP. Please enter 1234' });
  }

  const cleanPhone = (phone || '').replace(/\D/g, '');

  let userProfile: any;

  if (cleanPhone === '9876543210' || cleanPhone.endsWith('1210') || req.body.persona === 'person1') {
    // Person 1: Avinash Shinde (Citizen)
    userProfile = { ...PREDEFINED_USERS.person1 };
  } else if (cleanPhone === '9820112345' || cleanPhone.endsWith('2345') || req.body.persona === 'person2' || role === 'officer') {
    // Person 2: Er. Rajesh Kulkarni (Officer)
    userProfile = { ...PREDEFINED_USERS.person2 };
  } else {
    // Custom phone with OTP 1234
    userProfile = {
      id: `usr-${cleanPhone.slice(-6) || Date.now().toString().slice(-6)}`,
      email: `${cleanPhone || 'citizen'}@janmitra.gov.in`,
      name: name || `Citizen (${cleanPhone.slice(-4) || 'User'})`,
      phone: cleanPhone || '9876543210',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanPhone || 'citizen'}`,
      role: role === 'officer' ? 'officer' : 'citizen',
      problems_posted: 0,
      problems_solved: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };
  }

  return res.json({
    success: true,
    user: userProfile,
    token: `jwt_token_${userProfile.id}_${Date.now()}`,
    message: 'OTP verified successfully!',
  });
});

// 2. Get All Problems
app.get('/api/v1/problems', (req, res) => {
  res.json({ success: true, data: problems });
});

// 3. Post New Problem (Real-time broadcast)
app.post('/api/v1/problems', (req, res) => {
  const problemData = req.body;
  const newProblem = {
    ...problemData,
    id: problemData.id || `prob-real-${Date.now().toString().slice(-6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    upvotes: problemData.upvotes ?? 1,
    downvotes: problemData.downvotes ?? 0,
    views: 1,
    hype_score: problemData.hype_score ?? 1,
    hypeCount: problemData.hype_score ?? 1,
    hyped_by: problemData.hyped_by || (problemData.user?.id ? [problemData.user.id] : []),
    supporting_reports: problemData.supporting_reports || [],
  };

  problems.unshift(newProblem);
  persistProblems();

  // Broadcast in real-time to all other open clients!
  broadcast({
    type: 'problem:created',
    problem: newProblem,
    author: newProblem.user?.name || 'A Citizen',
  });

  res.status(201).json({ success: true, data: newProblem });
});

// 4. Real-time Upvote/Downvote
app.post('/api/v1/problems/:id/vote', (req, res) => {
  const { id } = req.params;
  const { userId, voteType } = req.body;

  const target = problems.find((p) => p.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  const voteKey = `${userId}_${id}`;
  const previousVote = userVotes[voteKey];

  if (previousVote === voteType) {
    // Un-vote
    if (voteType === 'upvote') target.upvotes = Math.max(0, target.upvotes - 1);
    if (voteType === 'downvote') target.downvotes = Math.max(0, target.downvotes - 1);
    delete userVotes[voteKey];
  } else {
    if (previousVote === 'upvote') target.upvotes = Math.max(0, target.upvotes - 1);
    if (previousVote === 'downvote') target.downvotes = Math.max(0, target.downvotes - 1);

    if (voteType === 'upvote') target.upvotes += 1;
    if (voteType === 'downvote') target.downvotes += 1;
    userVotes[voteKey] = voteType;
  }

  persistProblems();

  // Broadcast vote in real-time!
  broadcast({
    type: 'problem:voted',
    problemId: id,
    upvotes: target.upvotes,
    downvotes: target.downvotes,
    votedBy: userId,
  });

  res.json({
    success: true,
    upvotes: target.upvotes,
    downvotes: target.downvotes,
    userVote: userVotes[voteKey] || null,
  });
});

// 4b. Real-time Hype & Citizen Confirmations
app.post('/api/v1/problems/:id/hype', (req, res) => {
  const { id } = req.params;
  const { userId, user, note, image } = req.body;

  const target = problems.find((p) => p.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  if (!target.hyped_by) target.hyped_by = [];
  if (target.hype_score === undefined || target.hype_score === null) {
    target.hype_score = target.upvotes || 1;
  }
  if (!target.supporting_reports) target.supporting_reports = [];

  let isHyped = target.hyped_by.includes(userId);

  if (note || image) {
    const newReport = {
      id: `sr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      problem_id: id,
      user_id: userId,
      user_name: user?.name || 'Citizen',
      user_avatar: user?.avatar_url,
      notes: note,
      image: image,
      created_at: new Date().toISOString(),
    };
    target.supporting_reports.unshift(newReport);

    if (!isHyped) {
      target.hyped_by.push(userId);
      target.hype_score += 1;
      isHyped = true;
    } else {
      target.hype_score += 1;
    }
  } else {
    // Toggle hype
    if (isHyped) {
      target.hyped_by = target.hyped_by.filter((uid: string) => uid !== userId);
      target.hype_score = Math.max(0, target.hype_score - 1);
      isHyped = false;
    } else {
      target.hyped_by.push(userId);
      target.hype_score += 1;
      isHyped = true;
    }
  }

  target.hypeCount = target.hype_score;
  persistProblems();

  broadcast({
    type: 'problem:hyped',
    problemId: id,
    hype_score: target.hype_score,
    hyped_by: target.hyped_by,
    supporting_reports: target.supporting_reports,
    userId,
    userName: user?.name || 'A Citizen',
  });

  res.json({
    success: true,
    hype_score: target.hype_score,
    isHyped,
    supporting_reports: target.supporting_reports,
  });
});

// 5. Update Status (Officer action - Real-time)
app.patch('/api/v1/problems/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, notes, proofImage, officerName } = req.body;

  const target = problems.find((p) => p.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  const now = new Date().toISOString();
  target.status = status;
  target.updated_at = now;

  if (status === 'solved') {
    target.complaint_status = 'resolved';
    target.resolved_at = now;
    target.resolved_by = officerName || 'Er. Rajesh Kulkarni';
    if (notes) target.resolution_notes = notes;
    if (proofImage) target.solved_image = proofImage;
  } else if (status === 'being_helped') {
    target.complaint_status = 'assigned';
  } else if (status === 'in_progress') {
    target.complaint_status = 'in_progress';
  } else if (status === 'escalated') {
    target.complaint_status = 'escalated';
  }

  if (!target.timeline) target.timeline = [];
  target.timeline.push({
    id: `tl-${Date.now()}`,
    status: (target.complaint_status || status) as any,
    label: status === 'solved' ? 'Resolved & Verified' : status === 'in_progress' ? 'Work In Progress' : 'Status Updated',
    changed_by: officerName || 'Er. Rajesh Kulkarni',
    role: 'Municipal Officer',
    notes: notes || 'Updated via JanMitra Municipal Desk.',
    timestamp: now,
    proof_image: proofImage,
  });

  persistProblems();

  broadcast({
    type: 'problem:status_updated',
    problem: target,
    officerName: officerName || 'Er. Rajesh Kulkarni',
  });

  res.json({ success: true, data: target });
});

// 6. Comments & Chat real-time
app.post('/api/v1/problems/:id/comments', (req, res) => {
  const { id } = req.params;
  const { text, user } = req.body;

  const target = problems.find((p) => p.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  if (!target.comments) target.comments = [];
  const newComment = {
    id: `comm-${Date.now()}`,
    problem_id: id,
    user_id: user.id,
    user_name: user.name,
    user_role: user.role,
    text,
    created_at: new Date().toISOString(),
  };

  target.comments.push(newComment);
  persistProblems();

  broadcast({
    type: 'problem:comment_added',
    problemId: id,
    comment: newComment,
  });

  res.json({ success: true, data: newComment });
});

// Attach Vite middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`JanMitra real-time server active on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start JanMitra server:', err);
});
