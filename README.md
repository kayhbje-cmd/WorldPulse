# Smart Civic (JanMitra) - Citizen Civic Reporting Portal

<div align="center">

[![Milestone](https://img.shields.io/badge/Milestone-Phase%201%20(20%25)-emerald.svg)](#milestone-progress)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan.svg)](https://tailwindcss.com/)

**A modern, multilingual civic issue reporting and municipal resolution platform.**

</div>

---

## 📌 Project Overview
**Smart Civic** connects citizens directly with municipal departments and field engineers to report, track, and resolve civic infrastructure issues such as potholes, garbage accumulation, water pipeline leaks, street lighting failures, and accessibility barriers.

---

## 🎯 Milestone 1 Deliverables (20% Completed)

This release marks the completion of **Milestone 1 (Foundational 20%)**:

- [x] **Project Scaffolding & Build Configuration**:
  - Vite + React 19 + TypeScript configuration with strict type checks.
  - Tailwind CSS v4 styling system and PostCSS setup.
  - Progressive Web App (PWA) manifest and icon assets.
- [x] **Civic Domain Data Models & Types (`src/types/index.ts`)**:
  - `Problem` data contract with geospatial coordinates, urgency levels, and resolution states.
  - `Officer` and `Department` schemas for municipal hierarchy and routing.
  - `StatusHistoryItem` timeline audit log schemas.
  - `CostAnalysis` and severity rating models.
- [x] **Department & Category Registry (`src/constants/categories.ts`)**:
  - 8 core civic categories (Infrastructure, Sanitation, Utilities, Safety Hazards, Accessibility, Environment, Public Health, Other).
  - SLA configurations, department mapping, and multilingual category labels.
- [x] **Reusable UI Component Design System (`src/components/ui/`)**:
  - `Button` (primary, secondary, outline, danger variants with loading states)
  - `Card` (standard and interactive cards with headers, content, and footers)
  - `Badge` (status badges with variant color schemes)
  - `Input` (accessible inputs with error and hint messaging)
  - `Skeleton` (animated placeholder loaders for asynchronous feeds)
  - `EmptyState` (reusable empty state illustrations and call-to-actions)
- [x] **Milestone 1 Foundation Dashboard (`src/App.tsx`)**:
  - Interactive foundation shell showcasing project architecture, domain models, and UI component library.

---

## 🗺️ Project Implementation Roadmap

| Phase | Milestone | Progress | Scope | Status |
|---|---|---|---|---|
| **Phase 1** | **Foundation & Design System** | **20%** | **Project setup, domain contracts, categories, and UI component primitives** | **Completed** ✅ |
| Phase 2 | State & Core Services | 40% | Multilingual context (EN/HI/MR), Auth provider, and civic services | In Progress 🔄 |
| Phase 3 | Reporting & Civic Map | 60% | Geospatial Leaflet map, citizen feed, and issue reporting flow | Upcoming ⏳ |
| Phase 4 | Officer Portal & Tracking | 80% | Officer triage dashboard, SLA escalation, and status tracking | Upcoming ⏳ |
| Phase 5 | AI Assistant & PWA | 100% | Voice bot assistant, AI cost estimation, realtime WebSocket sync | Upcoming ⏳ |

---

## 💻 Tech Stack
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/vaijinathshinde07-spec/smart-civic.git
cd smart-civic

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` to view the Milestone 1 foundation shell.
