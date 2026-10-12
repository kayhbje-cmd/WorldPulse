# Bhandara Finder | Amravati, Maharashtra

<div align="center">

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-19%20Passing-emerald.svg)](https://vitest.dev/)

**A modern, responsive community-service platform for discovering and sharing Bhandara, J1 community meals, Annadan Seva, and Mahaprasad events.**

*Initially focused on Amravati, Maharashtra, India.*

</div>

---

## 📌 Project Overview

**Bhandara Finder** is a community discovery platform designed with a welcoming, sacred Indian aesthetic (saffron orange, warm cream, crisp white, and deep espresso brown). It connects devotees, students, and citizens with authentic upcoming and currently active community meals across Amravati.

Users can discover events, filter by locality or status, search by temple or menu, check live serving hours, get turn-by-turn directions via Google Maps, share event links via the Web Share API, report inaccurate timings, and submit new community feasts for admin verification.

---

## 🌟 Key Features

### 1. Modern, Culturally Grounded Design
- Warm Indian community-service palette: Saffron orange (`#EA580C`), warm cream (`#FDFBF7`, `#FEF3C7`), and dark espresso brown (`#291809`).
- Elegant typography (`Outfit` for headings, `Plus Jakarta Sans` for body text).
- Responsive on mobile, tablet, and desktop viewports.
- High-quality, culturally authentic photography of Mahaprasad feasts, temple distribution, and seva.

### 2. Live Dynamic Status Calculation
- **Currently Serving 🟢**: Dynamically calculated when the event is today and the current time is between `start_time` and `end_time`. Displays a pulsing beacon indicator.
- **Upcoming 🟡**: Upcoming events scheduled for future dates or later today.
- **Completed ⚪**: Automatically marked completed when event hours have passed.
- **Cancelled 🔴**: Flagged if cancelled by organizers or administrators.

### 3. Smart Search & Filters
- **Full-Text Search**: Matches title, locality, venue, street address, Mahaprasad menu items, and organizer name.
- **Category Filter**: Bhandara (भंडारा), Mahaprasad (महाप्रसाद), Annadan Seva (अन्नदान), Temple Feast (मंदिर महाप्रसाद), Community Meals / J1 (सामुदायिक जेवण).
- **Time Tabs**: All Events, Today, Currently Serving, Upcoming, Completed.
- **Amravati Localities**: Filter by Rajapeth, Gadge Nagar, Badnera, Camp, Panchavati, Sai Nagar, Irwin Square, Rukmini Nagar, VMV Road, etc.
- **Sorting**: Upcoming Date, Nearest First (when GPS is enabled), Recently Added.
- **Reset Filters**: One-click reset with clean empty state handling.

### 4. Real Geolocation & Haversine Distance
- HTML5 Geolocation is only requested upon explicit user click on **"Near Me (GPS)"**.
- Graceful handling of permission denial, timeouts, or unavailable location without fake GPS readings.
- Real straight-line distance computed using the Haversine formula (e.g. `1.2 km away` or `650 m away`).
- **"Get Directions"**: Direct one-click Google Maps link using exact coordinates or encoded venue details.

### 5. Event Submission Workflow (`/submit`)
- Validated with **Zod**:
  - Event title, category, description, organizer/mandal name.
  - Public contact number (strictly validated 10-digit Indian mobile number).
  - Date, start time, end time (verifies end time is after start time).
  - Venue name, full address, Amravati locality picker.
  - Mahaprasad menu details, special instructions, and poster presets.
  - Optional GPS pin of current location.
  - **Mandatory Consent Checkbox**: Informs the user how public event details will be displayed.
- Submissions are saved with `status: 'pending'` and **never** published automatically without admin approval.
- Generates a unique submission tracking ID with celebratory confetti.

### 6. Protected Admin Verification & Moderation Desk
- Secure sign-in dialog (`admin@bhandarafinder.org` / `Bhandara@Admin2026` for testing).
- **Pending Submissions**: Review full details, poster, and organizer phone; Approve or Reject with reason.
- **Live & Approved Events**: Edit details, mark cancelled or completed, and delete spam/duplicates.
- **Citizen Reports**: Review inaccuracies reported by users and mark them resolved or dismissed.
- **Direct Event Creation**: Publish pre-verified events immediately.

### 7. Dual-Mode Storage (Client-First + Supabase Ready)
- Works out of the box with persistent browser storage (localStorage) pre-seeded with realistic Amravati demonstration events.
- Full Supabase integration:
  - Ready for `@supabase/supabase-js`.
  - Comprehensive SQL schema in `supabase/schema.sql` including Row Level Security (RLS) policies.
  - Configurable via `.env.example` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### Installation
```bash
# Install dependencies
npm install --legacy-peer-deps
```

### Running the Application Locally
```bash
# Start Vite development server
npm run dev
```
The application will be live at `http://localhost:5173`.

### Running Automated Tests
```bash
# Run Vitest unit tests
npm run test
```

### Building for Production
```bash
# Type check and build static bundle
npm run lint
npm run build
```

---

## 🗄️ Database & Supabase Setup (Optional)

If you wish to connect to a live Supabase project:
1. Create a free project at [supabase.com](https://supabase.com).
2. Run the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor.
3. Create a `.env` file from `.env.example`:
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-public-api-key"
   ```
4. Restart `npm run dev`. The Navbar will immediately display **"Supabase Connected"**.

---

## 🔑 Admin Evaluation Credentials
For evaluation and testing of the moderation desk:
- **Email:** `admin@bhandarafinder.org`
- **Password:** `Bhandara@Admin2026`
*(Also accessible via the one-click "Auto-fill demo credentials" link on the Admin login screen.)*
