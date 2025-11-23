# Seema Biotech ERP UI Design

## Overview
This project is a React-based ERP UI for Seema Biotech, designed to manage indoor and outdoor biotech processes. It provides interfaces for media preparation, subculturing, incubation, hardening, and sampling operations, aiming to streamline biotech workflows.

## User Preferences
- Design: Dark green (#2E7D32) on light green (#E8F5E9) for better contrast.
- Operator Names: Indian names (Rajesh, Priya, Amit, Sunita, Vikram, Anjali, Deepak, Meena).
- Typography: Bold dark gray (#333333) for all headings.
- Workflow: Rapid feature implementation in fast mode (Redux, search, filter, CRUD all in one go).
- Tables: Hover effects with light green background for better UX.
- Multi-Select Dropdowns: White background (#fff) for proper visibility.
- Form Data: Captured via state + refs hybrid approach for Select/Input handling.

## System Architecture
The application is built with React 18 and TypeScript, using Vite 6 as the build tool. Tailwind CSS provides custom styling, complemented by Radix UI primitives for robust UI components. React Router DOM handles navigation. State management is centralized using Redux Toolkit and React-Redux, with custom hooks for type-safe access. Data visualization is achieved with Recharts.

Key features include:
- **State Management**: Centralized Redux store with 9 slices, one per module, implementing `addRecord`, `updateRecord`, `deleteRecord`, `setSearchTerm`, `setFilterStatus`, `setEditingId` actions. Immutable state updates are ensured, with automatic stats calculation and type-safe Redux access via `useAppDispatch()` and `useAppSelector()`.
- **Search & Filter**: Real-time search across all fields and status-based filtering (All, Pending, Active, Completed, Contaminated) for enhanced data navigation.
- **CRUD Operations**: Comprehensive Add, Edit, and Delete functionalities with form validation, auto-generated IDs, and immediate state updates.
- **Form Handling**: Utilizes `useRef`-based inputs, modal dialogs for add/edit, select dropdowns, date inputs, and text areas. Forms reset post-submission.
- **Data Features**: Includes government verification tracking, certificate number storage, and dynamic status tracking.
- **UI/UX**: Consistent dark green and light green color scheme, bold dark gray headings, light green table row hover effects, and white backgrounds for multi-select dropdowns. Filter buttons have been removed from all modules for a cleaner UI, and batch dropdown styling has been fixed for better visibility. Search buttons use a consistent blue color.
- **Routing**: Defined routes for indoor modules (Media Preparation, Subculturing, Incubation, Sampling) and outdoor modules (Primary Hardening, Secondary Hardening, Mortality, Holding Area, Outdoor Sampling).

## External Dependencies
- React 18
- TypeScript
- Vite 6
- Tailwind CSS
- React Router DOM
- Radix UI
- Lucide React (icons)
- Redux Toolkit
- React-Redux
- Recharts