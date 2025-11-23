# Seema Biotech ERP UI Design

## Overview
This is a React-based ERP (Enterprise Resource Planning) UI design for Seema Biotech. The application provides interfaces for managing indoor and outdoor biotech processes including media preparation, subculturing, incubation, hardening, and sampling operations.

## Project Architecture
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS with custom UI components
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts for data visualization

## Tech Stack
- React 18.3.1 with React Hooks (useState, useEffect, useRef, useCallback, useMemo, useContext)
- TypeScript 5.3.3
- Vite 6.3.5
- Tailwind CSS 3.4.0
- React Router DOM
- Radix UI components
- Lucide React (icons)
- Redux Toolkit + React-Redux for state management

## Project Structure
```
src/
├── components/
│   ├── common/         # Shared components (StatsCard, StatusBadge)
│   ├── figma/          # Figma-related components
│   ├── layout/         # Layout components (Header, Sidebar, Layout)
│   └── ui/             # Radix UI components
├── pages/
│   ├── indoor/
│   │   ├── MediaPreparation.tsx    # Media prep with 8-stage workflow table
│   │   ├── Subculturing.tsx        # Redux + search/filter + add/edit/delete
│   │   ├── Incubation.tsx          # Redux + search/filter + add/edit/delete
│   │   └── Sampling.tsx            # With government verification fields
│   ├── outdoor/
│   │   ├── PrimaryHardening.tsx    # Simplified form
│   │   ├── SecondaryHardening.tsx  # Redux + search/filter + add/edit/delete
│   │   ├── HoldingArea.tsx         # Redux + search/filter + add/edit/delete
│   │   ├── OutdoorSampling.tsx     # Redux + gov verification + add/edit/delete
│   │   └── Mortality.tsx           # Removed charts/graphs
│   └── Dashboard.tsx
├── store/
│   ├── store.ts                    # Redux store configuration
│   └── slices/
│       ├── subcultureSlice.ts      # Subculturing reducer + actions
│       ├── incubationSlice.ts      # Incubation reducer + actions
│       ├── secondaryHardeningSlice.ts
│       ├── holdingAreaSlice.ts
│       └── outdoorSamplingSlice.ts
├── hooks/
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   └── index.ts
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

## Development Setup
- Port: 5000
- Host: 0.0.0.0 (configured for Replit)
- Dev Server: Vite with Hot Module Replacement
- Redux DevTools compatible
- Hot reload for all pages and Redux slices

## Features Implemented

### State Management (Redux)
- Centralized Redux store with 5 slices (one per module)
- Actions: addRecord, updateRecord, deleteRecord, setSearchTerm, setFilterStatus, setEditingId
- Immutable state updates using Redux Toolkit
- Automatic stats calculation from state

### Search & Filter
- Real-time search across all fields
- Status-based filtering (All, Pending, Active, Completed, Contaminated)
- Combined search + filter in useMemo for performance

### CRUD Operations
- **Add**: Form modal with validation, auto-generates IDs
- **Edit**: Click edit button, form populates with record data, update saves to Redux
- **Delete**: Click delete button, immediate removal from Redux state
- **Display**: Table shows all records from Redux state

### Form Handling
- useRef-based form inputs for clean data collection
- Modal dialogs for add/edit operations
- Select dropdowns for categorical fields
- Date inputs for temporal data
- Textarea for remarks/observations
- Form resets after successful operations

### Data Features
- Government verification tracking (Indoor/Outdoor Sampling)
- Certificate number storage
- Indian operator names throughout
- Status tracking for all records
- Dynamic statistics based on live data

## User Preferences & Design Decisions
- Design: Dark green (#2E7D32) on light green (#E8F5E9) for better contrast
- Operator Names: Indian names (Rajesh, Priya, Amit, Sunita, Vikram, Anjali, Deepak, Meena)
- Typography: Bold dark gray (#333333) for all headings
- Workflow: Rapid feature implementation in fast mode (Redux, search, filter, CRUD all in one go)
- Tables: Hover effects with light green background for better UX
- Multi-Select Dropdowns: White background (#fff) for proper visibility
- Form Data: Captured via state + refs hybrid approach for Select/Input handling

## Latest Fixes (2025-11-23) - COMPLETED ✅
- **Add Forms - ALL PAGES**: Fully functional with formData state for all Select components
  - Subculturing: crop, stage, mediaUsed, status
  - Incubation: chamber, status
  - SecondaryHardening: crop, tunnel, bed, status
  - HoldingArea: crop, location, condition, status
  - OutdoorSampling: stage, crop, sampleType, testType, govVerified, status
- **Multi-Select Dropdowns**: White background (bg-white) applied to SelectTrigger & SelectContent on ALL pages
- **Form Reset**: After submit, all forms reset properly (refs cleared, formData reset to empty)
- **Data Persistence**: Form data immediately appears in table after submit
- **CRUD Operations**: All Add/Edit/Delete operations fully functional on all 5 pages
- **State Synchronization**: formData state + refs hybrid approach ensures proper Select value capture
- **useLocalStorage Hook**: Created in `/src/hooks/useLocalStorage.ts` with localStorage persistence
- **AppContext (Global Context)**: Created in `/src/context/AppContext.tsx` for global state management
- **App Provider**: Entire app wrapped with AppContextProvider
- **All React Hooks Implemented**: useState, useRef, useCallback, useMemo, useEffect, useContext, useLocalStorage

## Available Routes
### Indoor Module
- `/indoor/media-preparation` - Media Preparation
- `/indoor/subculturing` - Subculturing
- `/indoor/incubation` - Incubation
- `/indoor/sampling` - Sampling

### Outdoor Module
- `/outdoor/primary-hardening` - Primary Hardening
- `/outdoor/secondary-hardening` - Secondary Hardening
- `/outdoor/mortality` - Mortality
- `/outdoor/holding-area` - Holding Area
- `/outdoor/sampling` - Outdoor Sampling

## Recent Changes

### 2025-11-23: MAJOR Redux State Management & Full Functionality Implementation
- **Redux Integration**: Installed Redux Toolkit + React-Redux for centralized state management
- **5 Pages with Full Redux**: Subculturing, Incubation, Secondary Hardening, Holding Area, Outdoor Sampling
- **Search Functionality**: Real-time search across all record fields in all 5 pages
- **Filter by Status**: Dynamic status filtering (All, Pending, Active, Completed, Contaminated)
- **Add/Edit/Delete Operations**: Fully functional CRUD with Redux dispatch actions
- **Government Verification**: Added to Indoor & Outdoor Sampling with certificate tracking
- **React Hooks Usage**:
  - useState: Form state, modal state, editing state
  - useRef: Form input references for easy data collection
  - useCallback: Memoized event handlers for add/edit/delete
  - useMemo: Filtered records computation for search/filter
  - useEffect: Optional for future async operations
- **Dynamic Stats**: Stats cards automatically calculate values from Redux state
- **Indian Operator Names**: All pages use Indian names (Rajesh Kumar, Priya Sharma, Amit Patel, etc.)
- **Form Features**: 
  - Modal dialogs with validation
  - Scroll-enabled for long forms
  - Status dropdowns with all states
  - Date pickers for temporal data

### 2025-11-23: UI/UX Enhancements & Content Updates
- **Media Preparation**: Added 8-stage tissue culture workflow table with all stages
- **Sampling Pages**: Added government verification fields (Verified by Gov, Certificate Number, Reason)
- **Primary Hardening**: Removed grid view, simplified to table-only form
- **Mortality Page**: Removed all charts/graphs, kept key metrics and table
- **Typography**: Bold dark gray (#333333) headers in all tables
- **Hover Effects**: Light green hover (#F3FFF4) on all table rows
- **Active Tab Styling**: Dark gray background for selected tabs
- **Sidebar**: Improved with dark green hover effects, clickable icons in collapsed mode

### 2025-11-23: Initial UI Setup
- Changed default route to Media Preparation
- Improved sidebar hover effects with better color contrast
- Increased font sizes (nav 15px, headings +2px)
- Enhanced sidebar text readability

### 2025-11-23: Initial Project Setup in Replit
- Configured React 18 + TypeScript + Vite 6
- Tailwind CSS v4 configuration
- All dependencies installed
- Development workflow running on port 5000
