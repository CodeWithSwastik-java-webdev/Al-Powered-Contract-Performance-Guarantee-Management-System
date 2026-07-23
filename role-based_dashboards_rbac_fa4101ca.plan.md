---
name: Role-Based Dashboards RBAC
overview: Expand UserRole to seven enterprise roles, wire role-home redirects and route/sidebar guards, and ship distinct dashboards that read Railway Postgres via existing APIs—preserving local JWT auth and the current design system.
todos:
  - id: schema-roles
    content: Expand UserRole enum, add User.contractorId, migrate Railway, update seed accounts
    status: completed
  - id: backend-rbac
    content: Update rbac.ts matrix; role-scoped dashboard/list services; tighten route permissions
    status: completed
  - id: frontend-guards
    content: Add rbac config, HOME_BY_ROLE, RoleRoute, AuthContext role types, login redirect
    status: in_progress
  - id: sidebars-dashboards
    content: Role sidebars + 7 dashboard pages on real API data; thin stubs for missing nav modules
    status: pending
  - id: verify
    content: Seed, login each role, URL guard checks, TypeScript/build, summarize remaining gaps
    status: pending
isProject: false
---

# Role-Based Dashboards and RBAC

## Decisions (locked)

- **Auth stays local JWT** (email/password + `JWT_SECRET`). Firebase was already removed; reintroducing it is out of scope. Login still verifies JWT and loads role from Railway Postgres.
- **UI stays the existing Tailwind / KPI card system** (no new ShadCN install). Shared layout, soft white/green theme, Lucide icons, Recharts where already used.
- **Missing modules** (Documents, Reports, Audit Logs, Settings, Profile, Support, Projects, Notifications, Finance, Registration Requests) get **thin real pages**: auth-guarded shells that call Railway-backed endpoints when they exist, otherwise empty states — never hardcoded fake KPI numbers.
- **Contractor scoping**: add optional `contractorId` on `User` so `CONTRACTOR` users only see their linked contractor’s contracts/CPGs.

## Target role model

Replace Prisma `UserRole` enum values:

| New role | Home route | Seed account |
|---|---|---|
| `ADMIN` | `/admin/dashboard` | `admin@powergrid.com` |
| `PROJECT_ENGINEER` | `/engineer/dashboard` | `employee@powergrid.com` (migrated from `ENGINEER`) |
| `FINANCE_OFFICER` | `/finance/dashboard` | `finance@powergrid.com` (migrated from `FINANCE`) |
| `CONTRACT_MANAGER` | `/contracts/dashboard` | `manager@powergrid.com` (new) |
| `AUDITOR` | `/audit/dashboard` | `auditor@powergrid.com` (new) |
| `CONTRACTOR` | `/contractor/dashboard` | `contractor@powergrid.com` (was `VIEWER`) |
| `VIEWER` | `/viewer/dashboard` | `viewer@powergrid.com` |

Migration SQL will: add new enum values, `UPDATE users SET role = ...` for old values, then drop `ENGINEER`/`FINANCE` if Prisma requires rename via recreate pattern (PostgreSQL enum rename-safe script).

```mermaid
flowchart LR
  login[Login local JWT] --> profile[Load User role from Postgres]
  profile --> redirect[HOME_BY_ROLE]
  redirect --> admin[/admin/dashboard]
  redirect --> eng[/engineer/dashboard]
  redirect --> fin[/finance/dashboard]
  redirect --> cm[/contracts/dashboard]
  redirect --> aud[/audit/dashboard]
  redirect --> con[/contractor/dashboard]
  redirect --> view[/viewer/dashboard]
```

## Backend changes

### 1. Schema + Railway migration
- Update [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) `UserRole` to the seven roles.
- Add `contractorId String?` on `User` → optional FK to `Contractor`.
- New migration under `backend/prisma/migrations/…_rbac_roles/`.
- Apply with `prisma migrate deploy` / `db push` against Railway (same approach used earlier).

### 2. RBAC matrix — [`backend/src/config/rbac.ts`](backend/src/config/rbac.ts)
Map permissions (keep existing permission string constants; extend only if needed):

- **ADMIN**: all permissions + registration admin
- **PROJECT_ENGINEER**: contract/cpg/document write + read; no user manage
- **FINANCE_OFFICER**: CPG/finance read + `cpg:manage_status`; no user write
- **CONTRACT_MANAGER**: contract/contractor write; CPG read/write
- **AUDITOR**: `audit:read` + all `*:read` only
- **CONTRACTOR**: scoped read of own contracts/CPGs/documents + notifications
- **VIEWER**: read-only portfolio (reports/notifications/profile)

### 3. Auth / seed
- Update [`backend/scripts/seed-local-accounts.ts`](backend/scripts/seed-local-accounts.ts) + [`LOCAL_LOGIN_ACCOUNTS.md`](LOCAL_LOGIN_ACCOUNTS.md) for all seven accounts; link contractor user to a seeded contractor via `contractorId`.
- Ensure login response includes `role` (and `contractorId` when present).

### 4. Dashboard + list scoping
- Extend [`backend/src/services/dashboard.service.ts`](backend/src/services/dashboard.service.ts) with `getStatsForUser(user)` / admin extras (pending registrations, total users/contractors, released/expiring CPG counts) — **all from Prisma**.
- For `CONTRACTOR`: filter contracts/CPGs by `contractorId`.
- Tighten [`backend/src/routes/dashboard.routes.ts`](backend/src/routes/dashboard.routes.ts) and list endpoints so contractor/viewer/auditor cannot write; reuse existing `requirePermission` / `requireRoles`.

## Frontend changes

### 1. Shared RBAC config
New [`frontend/src/config/rbac.ts`](frontend/src/config/rbac.ts):
- `AppRole` union matching backend
- `HOME_BY_ROLE`
- `NAV_BY_ROLE` (sidebar items per role exactly as specified)
- `canAccessRoute(role, path)` helper

### 2. AuthContext
Update [`frontend/src/contexts/AuthContext.tsx`](frontend/src/contexts/AuthContext.tsx):
- Expand `AppUser.role` to seven roles; optional `contractorId`
- After login: `navigate(HOME_BY_ROLE[role])` (or let `PublicRoute` / login page do it — single place only)
- Wire logout; show real name/role in Sidebar footer

### 3. Router guards — [`frontend/src/app/router.tsx`](frontend/src/app/router.tsx)
- Keep `ProtectedRoute` (auth).
- Add `RoleRoute({ roles | allow })` — unauthorized → redirect to that user’s home (never another role’s dashboard).
- Register role homes and shared resource routes with role allow-lists, e.g.:
  - `/admin/*` → ADMIN only
  - `/engineer/*` → PROJECT_ENGINEER
  - `/finance/*` → FINANCE_OFFICER
  - `/contracts/dashboard` → CONTRACT_MANAGER
  - `/audit/*` → AUDITOR
  - `/contractor/*` → CONTRACTOR
  - `/viewer/*` → VIEWER
  - `/contracts`, `/cpgs`, `/contractors` → roles that have those nav items
- Index `/` → redirect via `HOME_BY_ROLE[user.role]`

### 4. Sidebar — [`frontend/src/shared/components/layout/Sidebar.tsx`](frontend/src/shared/components/layout/Sidebar.tsx)
- Replace static `navItems` with `NAV_BY_ROLE[user.role]`
- Footer: `user.name` + role label from `useAuth()`

### 5. Role dashboards (real data, shared design language)
New pages under `frontend/src/app/pages/dashboards/`:
- `AdminDashboardPage` — pending registrations, users, contractors, contracts, active/released/expiring CPG, charts, activity, quick actions linking to real routes
- `EngineerDashboardPage` — assigned/active contracts, pending verification CPGs, expiring soon, recent activity
- `FinanceDashboardPage` — BG exposure (sum ACTIVE CPG), released/expiring, charts
- `ContractManagerDashboardPage` — running vs completed contracts, contractors link, activity
- `AuditorDashboardPage` — audit logs + read-only stats (no write CTAs)
- `ContractorDashboardPage` — **scoped** my contracts / my CPGs / expiring / profile completion
- `ViewerDashboardPage` — read-only reports/notifications summary

Reuse existing API client + React Query patterns from [`DashboardPage.tsx`](frontend/src/app/pages/DashboardPage.tsx). Refactor current portfolio KPIs into a small shared `KpiCard` / chart section if needed — do not rewrite working modules.

### 6. Thin module pages for sidebar completeness
Add minimal guarded pages (empty state or list if API exists) so every sidebar link resolves:
- Registration Requests (admin — wire to existing `/registrations` API if present)
- User Management, Audit Logs, Documents, Reports, Notifications, Profile, Settings, Support, Projects, Finance

Where backend list APIs already exist, show DataTable; otherwise empty state copy — **no fake stats**.

## Verification

1. Apply migration + `npm run seed:accounts` + ensure contractor link.
2. Login each of 7 accounts → lands on correct home; sidebar matches role.
3. Manually hit `/admin/dashboard` as VIEWER/CONTRACTOR → redirected to own home.
4. CONTRACTOR cannot see other vendors’ contracts.
5. `tsc` / frontend build + backend typecheck clean.
6. Fix any broken `.js` companions that Vite may resolve ahead of `.tsx` (same issue as ContractsPage).

## Out of scope (explicit)

- Rebuilding Firebase Auth
- Full Documents/Reports/Audit product features beyond shells + existing APIs
- Visual redesign / new component library
- Rewriting contract/CPG CRUD services
