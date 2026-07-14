# AI-Powered Contract Performance Guarantee (CPG) Management System

## Project Overview

This project is an enterprise-grade web application developed for POWERGRID Corporation of India Limited.

The application manages the complete lifecycle of Contract Performance Guarantees (CPGs), contractor onboarding, contract management, AI-powered risk analysis, document management, reporting and audit logging.

The project must always follow enterprise software engineering practices.

---

# General Rules

Before implementing any feature:

1. Read the documentation inside the docs folder.

2. Preserve existing working functionality.

3. Never rewrite working modules unless necessary.

4. Improve existing implementations instead of replacing them.

5. Implement one module at a time.

6. Never modify unrelated files.

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- TanStack Query
- React Hook Form
- Zod
- Framer Motion
- Recharts

Backend

- Node.js
- Express
- Prisma

Database

- Railway PostgreSQL

Authentication

- Firebase Authentication

Storage

- Cloudinary

AI

- Python
- FastAPI
- Scikit-learn

---

# Coding Standards

Always:

- Use TypeScript
- Use reusable components
- Follow clean architecture
- Write readable code
- Use descriptive variable names
- Use async/await
- Handle errors properly
- Validate all inputs
- Create reusable hooks
- Create reusable UI components

Never:

- Use inline styles
- Duplicate code
- Hardcode API URLs
- Hardcode colors
- Hardcode dummy arrays
- Ignore TypeScript errors

---

# UI Rules

The application should look like an enterprise SaaS platform.

Design inspiration:

- Microsoft Azure
- Atlassian
- SAP Fiori
- Notion
- Linear

Theme:

Soft White

Soft Green

Light Grey

Professional

Elegant

Minimal

Responsive

Avoid bright colors.

Avoid clutter.

Avoid generic admin templates.

---

# Branding

Use the POWERGRID logo professionally.

The logo should appear on:

- Login
- Sidebar
- Dashboard
- Loading Screen
- Footer
- Reports

Do not oversize the logo.

---

# Authentication Rules

There is NO traditional Register page.

The Login page contains:

"New to POWERGRID?"

Request Access

Clicking Request Access opens the Registration Wizard.

Registration categories:

- POWERGRID Employee
- Contractor / Vendor

Users never choose their own role.

Roles are assigned by administrators.

Authentication uses Firebase Authentication.

Passwords must never be stored in PostgreSQL.

Passwords must never be visible to administrators.

---

# Registration Workflow

Request Access

↓

Registration Wizard

↓

Validation

↓

Upload Documents

↓

Cloudinary

↓

Registration stored in Railway PostgreSQL

↓

Status = Pending Approval

↓

Administrator Review

↓

Approve / Reject / Request More Information

↓

If approved

↓

Account becomes ACTIVE

↓

User can Login

---

# Database Rules

Railway PostgreSQL is the source of truth.

Never use:

- local JSON
- hardcoded arrays
- fake dashboard data

Every page must fetch data through backend APIs.

Use Prisma ORM.

Use proper relationships.

Create audit records where necessary.

---

# Backend Rules

Controllers

↓

Services

↓

Prisma

↓

Database

Business logic belongs inside Services.

Controllers should remain thin.

---

# Frontend Rules

Organize by features.

Create reusable components.

Every page should include:

- Loading State
- Error State
- Empty State
- Responsive Layout

Use TanStack Query for data fetching.

Never fetch data directly inside components using fetch().

---

# Forms

Use:

React Hook Form

Zod Validation

Every form should include:

- Live validation
- Error messages
- Loading state
- Disabled state
- Success feedback

---

# Dashboard

Dashboard data must come from Railway PostgreSQL.

Never use placeholder values.

Dashboard includes:

- KPI Cards
- Charts
- Notifications
- AI Insights
- Recent Activity
- Quick Actions

---

# Document Storage

Files

↓

Cloudinary

Metadata

↓

Railway PostgreSQL

Never store files in PostgreSQL.

---

# AI Rules

The AI service is separate from the backend.

Use FastAPI.

Never generate fake AI values.

Health Score

Priority Ranking

Risk Prediction

Recommendations

should all come from backend APIs.

---

# Performance

Use:

Lazy Loading

Memoization

Code Splitting

TanStack Query caching

Reusable hooks

Avoid unnecessary re-renders.

---

# Security

Validate every request.

Protect every route.

Implement RBAC.

Record audit logs.

Never expose internal server errors.

Never expose sensitive information.

---

# Code Quality

Prefer readability over clever code.

Small reusable components.

Small reusable functions.

Strong typing.

Consistent naming.

Consistent folder structure.

---

# Development Process

When implementing a feature:

1. Analyze the existing implementation.

2. Identify missing functionality.

3. Fix bugs.

4. Improve UI.

5. Improve UX.

6. Connect backend.

7. Connect database.

8. Test.

9. Summarize changes.

Do not proceed to another module until the current module is complete.

---

# Final Goal

The final application should resemble a production-ready enterprise software platform used by POWERGRID officers rather than a student project.

Every decision should prioritize:

- Maintainability
- Scalability
- Security
- Performance
- Professional UI/UX
- Clean Architecture