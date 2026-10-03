// src/App.tsx - Milestone 1 (20% Completed): Architecture, Domain Models & UI Design System
import React, { useState } from 'react';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { Input } from './components/ui/Input';
import { EmptyState } from './components/ui/EmptyState';
import { PROBLEM_CATEGORIES, DEPARTMENTS, PRIORITY_OPTIONS, STATUS_CONFIG } from './constants/categories';
import { 
  Building2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle,
  Github,
  Code2,
  Palette,
  Server,
  Compass,
  ArrowRight
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'domain' | 'roadmap'>('overview');
  const [sampleInput, setSampleInput] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-gray-900 tracking-tight">Smart Civic</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  Milestone 1 • 20%
                </span>
              </div>
              <p className="text-xs text-gray-500">Citizen Civic Portal Architecture</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/vaijinathshinde07-spec/smart-civic"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              <Github size={15} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Milestone Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-medium">
              <Sparkles size={14} className="text-emerald-300" />
              <span>Project Progress: 20% Completed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Phase 1: Architecture, Domain Models & UI System
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Foundational release of the Smart Civic (JanMitra) platform. Establishing core TypeScript domain contracts, Tailwind CSS v4 design tokens, atomic UI component library, and municipal departmental taxonomy.
            </p>
            
            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-emerald-200">
                <span>Phase 1 Deliverables</span>
                <span>20% Complete</span>
              </div>
              <div className="w-full h-3 bg-emerald-950/60 rounded-full overflow-hidden p-0.5 border border-emerald-700/50">
                <div className="h-full bg-linear-to-r from-emerald-400 to-teal-300 rounded-full w-1/5 shadow-sm transition-all duration-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Compass size={16} />
            <span>Overview & Deliverables</span>
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'components'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Palette size={16} />
            <span>UI Design System</span>
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'domain'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Server size={16} />
            <span>Civic Domain Models</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Layers size={16} />
            <span>Milestone Roadmap</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Code2 size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Vite & React 19 Scaffolding</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Configured with strict TypeScript, Vite bundling, and modern React 19 architecture for high performance.
                </p>
                <Badge variant="success" size="sm">Configured</Badge>
              </Card>

              <Card className="p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Server size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Civic Domain Contracts</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Defined comprehensive schemas for Problems, Officers, Departments, Alerts, and SLA timeline records.
                </p>
                <Badge variant="secondary" size="sm">Types Defined</Badge>
              </Card>

              <Card className="p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Palette size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Atomic UI Library</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Tailwind CSS v4 component primitives including Buttons, Cards, Inputs, Badges, and Skeletons.
                </p>
                <Badge variant="primary" size="sm">Design System Ready</Badge>
              </Card>
            </div>

            {/* Checklist */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Milestone 1 Completed Items</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                <div className="flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>React 19 + TypeScript strict configuration</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Tailwind CSS v4 design tokens and utility setup</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Civic entity data contracts (Problem, Officer, Dept)</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>8 Civic problem categories with municipal routing</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Reusable atomic UI primitives (Buttons, Cards, Badges)</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Responsive layout shell and navigation baseline</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: UI DESIGN SYSTEM */}
        {activeTab === 'components' && (
          <div className="space-y-6">
            {/* Buttons */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Button Primitives</h3>
              <p className="text-xs text-gray-500">Accessible button components with responsive sizing and loading states.</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
                <Button
                  variant="primary"
                  loading={buttonLoading}
                  onClick={() => {
                    setButtonLoading(true);
                    setTimeout(() => setButtonLoading(false), 2000);
                  }}
                >
                  {buttonLoading ? 'Processing...' : 'Click for Loading State'}
                </Button>
              </div>
            </Card>

            {/* Badges */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Badge Primitives</h3>
              <p className="text-xs text-gray-500">Status tags for complaint triage, SLA tracking, and urgency ratings.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="primary">Submitted</Badge>
                <Badge variant="secondary">Under Review</Badge>
                <Badge variant="warning">In Progress</Badge>
                <Badge variant="success">Resolved</Badge>
                <Badge variant="danger">Escalated</Badge>
                <Badge variant="info">Officer Assigned</Badge>
                <Badge variant="neutral">Draft</Badge>
              </div>
            </Card>

            {/* Form Inputs */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Input Components</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <Input
                  label="Civic Issue Title"
                  placeholder="e.g. Broken water pipeline on Main Street"
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  helperText="Clear and concise summary of the issue."
                />
                <Input
                  label="Location"
                  icon={<MapPin size={16} />}
                  placeholder="Auto-detected or enter street name"
                />
              </div>
            </Card>

            {/* Empty State Component */}
            <Card className="p-6">
              <h3 className="text-base font-bold text-gray-900 mb-2">Empty State Pattern</h3>
              <EmptyState
                icon="📋"
                title="No Civic Reports Found"
                description="All civic complaints in your ward have been processed or resolved by the respective municipal officers."
                actionText="Explore Design System"
                onAction={() => setActiveTab('overview')}
              />
            </Card>
          </div>
        )}

        {/* TAB 3: CIVIC DOMAIN MODELS */}
        {activeTab === 'domain' && (
          <div className="space-y-6">
            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900">Supported Civic Categories (8)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PROBLEM_CATEGORIES.map((cat) => (
                  <Card key={cat.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{cat.emoji}</span>
                      <Badge variant="neutral" size="sm">{cat.id}</Badge>
                    </div>
                    <h4 className="font-bold text-sm text-gray-800">{cat.name}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{cat.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Municipal Departments */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Building2 size={18} className="text-emerald-600" />
                <span>Municipal Departments</span>
              </h3>
              <div className="divide-y divide-gray-100">
                {DEPARTMENTS.map((dept) => (
                  <div key={dept.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{dept.name}</h4>
                      <p className="text-[11px] text-gray-500">Contact: {dept.contact_number}</p>
                    </div>
                    <Badge variant="secondary" size="sm">{dept.category}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900">Project Phasing & Roadmap</h3>
            
            <div className="space-y-3">
              {/* Phase 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-emerald-950">Phase 1 (20% Completed) - Architecture & Design System</h4>
                    <Badge variant="success" size="sm">Completed</Badge>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    Vite scaffold, TypeScript domain types, Tailwind design system, reusable component library, and base foundation shell.
                  </p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">Phase 2 (40%) - State Management & Multilingual Support</h4>
                    <Badge variant="secondary" size="sm">Next</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Authentication provider (citizen & officer personas), Language provider (English, Hindi, Marathi), and core issue storage services.
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">Phase 3 (60%) - Issue Reporting & Interactive Civic Map</h4>
                    <Badge variant="neutral" size="sm">Upcoming</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Interactive Leaflet GIS map with geolocation pins, issue submission with photo upload, citizen feed, and upvoting system.
                  </p>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">Phase 4 (80%) - Officer Triage & Tracking</h4>
                    <Badge variant="neutral" size="sm">Upcoming</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Municipal officer dashboard, complaint lifecycle management (Submitted → In Progress → Resolved), SLA escalation, and analytics.
                  </p>
                </div>
              </div>

              {/* Phase 5 */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  5
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">Phase 5 (100%) - AI Assistant & PWA</h4>
                    <Badge variant="neutral" size="sm">Upcoming</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Multilingual voice assistant, AI cost and repair time estimation, real-time WebSocket notifications, and offline PWA support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 Smart Civic (JanMitra) Portal • Phase 1 Milestone</p>
          <div className="flex items-center gap-4">
            <span>React 19 + TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS v4</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
