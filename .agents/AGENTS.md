# Antigravity Agent Workspace Context & Instructions

This workspace contains the **AI-Powered Contract Performance Guarantee (CPG) Management System**. 
A comprehensive audit and implementation plan have already been completed and approved. 

## Project Context
- **Backend**: Express.js, TypeScript, Prisma ORM, Postgres, Zod, Pino logging, Firebase Auth middleware.
- **Frontend**: Vite, React, React Router, Tailwind CSS (Mock auth, mock data, no backend integration yet).
- **Goal**: Build the missing pages, wire them to the backend APIs, add actual Firebase authentication, and implement risk analysis & notifications.

## Status of Steps
- [x] Project Audit: Completed.
- [x] Implementation Plan: Completed and approved.
- [ ] Task Execution: Ready to begin.

## Instructions for New Conversations
1. **Do not re-audit or re-plan**: Do not start a new planning phase or ask the user to re-approve the architecture. The current approved plan is documented below and in [docs/implementation_plan.md](file:///d:/POWERGRID/CPG/docs/implementation_plan.md).
2. **Resume Execution**: Create a `task.md` in your conversation artifacts folder and begin executing the tasks outlined below, starting with:
   - Setting up the Vite API proxy in frontend.
   - Integrating the actual Firebase Auth on the frontend.
   - Creating the Prisma seed script to populate the database for development.

---

## Approved Implementation Plan

### Phase 1: Foundation & Data (Must Be First)
> **Goal:** Get the database seeded, Firebase auth working, and frontend connected to real APIs.
- **[MODIFY] [schema.prisma](file:///d:/POWERGRID/CPG/backend/prisma/schema.prisma)**: Add `SUBMITTED` and `VERIFIED` to `CpgStatus` enum; add `updatedAt` to `Document` model.
- **[NEW] `backend/prisma/seed.ts`**: Idempotent script inserting realistic Contractors, Contracts, CPGs, Documents, Notifications, Audit Logs, Risk Assessments, and an admin User.
- **[MODIFY] [package.json](file:///d:/POWERGRID/CPG/backend/package.json)**: Add `prisma:seed` script.
- **[MODIFY] [env.ts](file:///d:/POWERGRID/CPG/backend/src/config/env.ts)**: Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `ML_SERVICE_URL`.
- **[MODIFY] [index.html](file:///d:/POWERGRID/CPG/frontend/index.html)**: Add Google Fonts (Inter) link, favicon, and meta description.
- **[MODIFY] [globals.css](file:///d:/POWERGRID/CPG/frontend/src/styles/globals.css)**: Fix dark mode selector from `document[data-theme='dark']` to `[data-theme='dark']`.
- **[MODIFY] [vite.config.ts](file:///d:/POWERGRID/CPG/frontend/vite.config.ts)**: Add API proxy to backend (`/api` -> `http://localhost:3000`).
- **Clean Stale Files**: Delete duplicate `.js` files alongside `.tsx` files (e.g. `App.js`, `main.js`, `router.js`).

### Phase 2: Auth & User Module
- **[MODIFY] [AuthContext.tsx](file:///d:/POWERGRID/CPG/frontend/src/contexts/AuthContext.tsx)**: Replace mock auth with Firebase `signInWithEmailAndPassword`, store/manage ID tokens, call sync API `POST /api/v1/auth/sync-login`, add registration and loading states.
- **[NEW] `frontend/src/lib/firebase.ts`**: Initialize Firebase app using env variables.
- **[NEW] `frontend/src/lib/api.ts`**: Create Axios API client instance with auth token interceptor and global error handling.
- **[MODIFY] [Sidebar.tsx](file:///d:/POWERGRID/CPG/frontend/src/shared/components/layout/Sidebar.tsx)**: Dynamically show user avatar/info, complete nav links, mobile drawer toggles, and logout.
- **[MODIFY] [TopNav.tsx](file:///d:/POWERGRID/CPG/frontend/src/shared/components/layout/TopNav.tsx)**: Add dynamic breadcrumbs, notification panel/badge, and user menu dropdown.

### Phase 3: Dashboard Module
- **[NEW] Backend Dashboard Routes**: Create `dashboard.controller.ts`, `dashboard.service.ts`, and `dashboard.routes.ts` (`GET /api/v1/dashboard/stats`, `GET /api/v1/dashboard/recent-activity`, `GET /api/v1/dashboard/charts`, `GET /api/v1/dashboard/expiring-soon`).
- **[MODIFY] [DashboardPage.tsx](file:///d:/POWERGRID/CPG/frontend/src/app/pages/DashboardPage.tsx)**: Integrate TanStack Query for dynamic stats, Recharts area/pie charts, and activity/notification widgets.

### Phase 4: Contract Module
- **[NEW] Shared UI Components**: Implement reusable `DataTable`, `StatusBadge`, `SearchInput`, `Modal/SlideOver`, `EmptyState`, `Skeleton`, and `ConfirmDialog` components.
- **[MODIFY] [ContractsPage.tsx](file:///d:/POWERGRID/CPG/frontend/src/app/pages/ContractsPage.tsx)**: Query contract data from API, support filtering, sorting, pagination, and a create contract modal.
- **[MODIFY] [ContractPage.tsx](file:///d:/POWERGRID/CPG/frontend/src/app/pages/ContractPage.tsx)**: Show dynamic fields, tabs for CPGs/Documents/Audit logs, edit form, and deletion.
- **[NEW] Contractor CRUD**: Backend routing and frontend table for vendor management (contractor lookup).

### Phase 5: CPG Module
- **[MODIFY] [CpgsPage.tsx](file:///d:/POWERGRID/CPG/frontend/src/app/pages/CpgsPage.tsx)**: Full CPG data table, search/filters, and action modal for verification/extension/release.
- **[NEW] `CpgDetailPage.tsx`**: Status progress stepper, action buttons, risk gauge, scan anomalies, and renewal chains.
- **[MODIFY] Router**: Add `/cpgs/:id` route.

### Phase 6: Document Module
- **[NEW] Backend File Upload**: Setup Multer + Cloudinary storage, download proxies, listing by CPG, and versioning.
- **[NEW] Frontend Document UI**: Drag & drop zone, document list, versions history, and previews.

### Phase 7: Notifications & Audit Logs
- **[NEW] Backend Notifications/Audit**: Auto-create notifications on CPG events, read/unread endpoints, and paginated logs API.
- **[NEW] Frontend Pages**: `NotificationsPage.tsx` and `AuditLogsPage.tsx` with timelines and filtering.

### Phase 8: AI Module & ML Service
- **[NEW] `ml-service/` (Python FastAPI)**: Build Random Forest regression model on synthetic/historical data to predict delay risk and health scores.
- **[NEW] Backend ML integration**: Store results in `MlPrediction` table, predict periodically.
- **[NEW] Frontend: `AIRiskPage.tsx`**: Interactive risk heatmaps, priority ranking table, and anomaly alerts.

### Phase 9: AI Assistant
- **[NEW] floating chat widget & Backend**: Floating circular chat panel with Framer Motion, natural language processing for dashboard statistics, risk queries, and report generation.

### Phase 10: Reports Module
- **[NEW] Backend & Frontend Reports**: Generate PDF/Excel files, filters, preview, and download history.

### Phase 11: Polish & Performance
- Add Framer Motion transitions, skeleton screens, TanStack caching policies, loading animations, and ShadCN components.
