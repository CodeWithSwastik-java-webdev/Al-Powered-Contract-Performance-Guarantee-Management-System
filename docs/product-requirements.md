# Product Requirements Document (PRD)

## Project Information

**Project Name:** AI-Powered Contract Performance Guarantee (CPG) Management System

**Organization:** POWERGRID Corporation of India Limited

**Version:** 1.0

**Project Type:** Enterprise Internal Web Application

---

# 1. Overview

The AI-Powered Contract Performance Guarantee (CPG) Management System is an enterprise web application developed to digitize and automate the complete lifecycle of Contract Performance Guarantees within POWERGRID.

The platform enables employees and contractors to manage contracts, guarantees, documents, approvals, reports, and AI-driven risk analysis from a centralized dashboard.

The application emphasizes security, scalability, transparency, and automation while following enterprise software engineering practices.

---

# 2. Objectives

The system aims to:

- Digitize the complete CPG lifecycle
- Centralize contract and contractor management
- Automate registration approval workflows
- Reduce manual tracking of CPG expiry
- Provide AI-powered risk prediction
- Maintain complete audit history
- Improve reporting and analytics
- Provide an enterprise-grade user experience

---

# 3. User Categories

The application supports two registration categories.

### POWERGRID Employee

Internal users responsible for managing contracts, guarantees, finance, approvals and administration.

### Contractor / Vendor

External users who participate in bids, submit CPGs, upload documents and monitor contract status.

---

# 4. System Roles

Roles are assigned **only by the administrator** after approval.

Available roles:

- SUPER_ADMIN
- PROJECT_ENGINEER
- FINANCE_OFFICER
- CONTRACT_MANAGER
- SENIOR_MANAGER
- AUDITOR
- CONTRACTOR
- VIEWER

Role Based Access Control (RBAC) will be implemented across the application.

---

# 5. Authentication

Authentication uses:

- Firebase Authentication
- Email & Password
- Railway PostgreSQL
- JWT Authentication

No Google Login.

No Phone OTP.

Passwords are managed only by Firebase.

Passwords are never stored in PostgreSQL.

---

# 6. Registration Workflow

The application does not expose a traditional Register page.

The Login page contains:

> **New to POWERGRID? Request Access**

Clicking this opens the Registration Wizard.

Registration Steps:

1. Select User Category
2. Fill Registration Form
3. Upload Documents
4. Review Information
5. Submit

After submission:

- Registration Request is stored in Railway PostgreSQL
- Status becomes **Pending Approval**
- User cannot access the application

---

# 7. Approval Workflow

Administrator reviews every registration request.

Available actions:

- Approve
- Reject
- Request More Information

If approved:

- User status becomes Active
- Default role is assigned
- User receives an approval email
- User can log in

If rejected:

- User receives rejection reason
- Login remains disabled

---

# 8. Main Modules

The application contains the following modules:

- Authentication
- Dashboard
- User Management
- Contractor Management
- Contract Management
- CPG Management
- Document Management
- Notifications
- Reports
- Audit Logs
- AI Engine
- AI Assistant
- Settings

---

# 9. Dashboard

The dashboard should display live information from Railway PostgreSQL.

Dashboard includes:

- KPI Cards
- Recent Contracts
- Recent CPGs
- Notifications
- AI Insights
- Health Score
- Priority Ranking
- Risk Distribution
- Quick Actions

No static placeholder data.

---

# 10. Contract Management

Features:

- Create Contract
- Edit Contract
- Search
- Filter
- Export
- Contract Timeline
- Contract History
- Linked Contractor
- Linked CPG

---

# 11. Contractor Management

Features:

- Contractor Profile
- Company Information
- Documents
- Performance History
- Active Contracts
- Risk Level
- Contact Details

---

# 12. CPG Management

The complete CPG lifecycle must be supported.

Statuses include:

- Draft
- Submitted
- Verified
- Active
- Extended
- Released
- Expired

Each status change must be logged.

---

# 13. Document Management

Documents are stored in Cloudinary.

Metadata is stored in Railway PostgreSQL.

Supported features:

- Upload
- Preview
- Download
- Version History
- Categories
- Search

---

# 14. AI Features

Version 1 AI Features:

- Risk Prediction
- Health Score
- Priority Ranking
- Anomaly Detection
- AI Recommendations

All AI results must be generated from backend services.

No hardcoded values.

---

# 15. AI Assistant

The application includes a floating AI assistant.

Capabilities:

- Answer questions about contracts
- Search CPGs
- Explain risk predictions
- Provide dashboard summaries
- Recommend next actions

The assistant must use live backend data.

---

# 16. Notifications

Notification types:

- Registration
- Contract
- CPG
- Document
- AI Alerts
- System Updates

Users can mark notifications as read.

---

# 17. Reports

Generate:

- PDF
- Excel
- CSV

Reports include:

- Contracts
- CPGs
- Contractors
- AI Analytics
- Audit Logs

---

# 18. Security

The application must:

- Use Firebase Authentication
- Implement RBAC
- Protect backend APIs
- Validate all user input
- Record audit logs
- Prevent unauthorized access

---

# 19. Design Principles

The application should feel like an enterprise SaaS platform.

Design goals:

- Minimal
- Modern
- Elegant
- Responsive
- Professional

Use:

- Soft White
- Soft Green
- Light Grey

Avoid bright colors.

The UI should resemble products such as Microsoft Azure, Atlassian, SAP Fiori and Notion.

---

# 20. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- TanStack Query
- React Hook Form
- Framer Motion
- Recharts

## Backend

- Node.js
- Express
- Prisma

## Database

- Railway PostgreSQL

## Authentication

- Firebase Authentication

## Storage

- Cloudinary

## AI & ML

- Python
- FastAPI
- Scikit-learn

---

# 21. Development Rules

- Preserve existing working code.
- Never use local JSON or static arrays.
- Fetch all application data from Railway PostgreSQL.
- Build reusable components.
- Follow clean architecture.
- Use TypeScript throughout.
- Keep the UI consistent with the Design System.
- Complete one module before moving to the next.

---

# 22. Version 1 Scope

Version 1 includes:

- Authentication
- Registration Approval
- Dashboard
- Contracts
- Contractors
- CPG Management
- Documents
- Notifications
- Reports
- AI Engine
- AI Assistant

Future enhancements such as Redis, Kafka, Kubernetes and GraphQL are reserved for Version 2.