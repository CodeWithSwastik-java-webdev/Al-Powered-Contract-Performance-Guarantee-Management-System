# System Architecture

## Project

AI-Powered Contract Performance Guarantee (CPG) Management System

---

# 1. Architecture Overview

The application follows a layered enterprise architecture.

```
React Frontend
        │
        ▼
Express Backend (REST API)
        │
        ├──────────────┐
        ▼              ▼
Railway PostgreSQL   Cloudinary
        │
        ▼
Firebase Authentication

        │
        ▼
Python ML Service (FastAPI)
```

Each service has a single responsibility.

---

# 2. Technology Stack

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

---

## Backend

- Node.js
- Express
- Prisma ORM

---

## Database

Railway PostgreSQL

Stores:

- Users
- Contractors
- Contracts
- CPGs
- Documents Metadata
- Notifications
- Reports
- Audit Logs
- AI Results

---

## Authentication

Firebase Authentication

Responsibilities:

- Email Authentication
- Password Management
- Password Reset
- JWT Authentication

User profile information is stored in PostgreSQL.

---

## Storage

Cloudinary

Stores:

- GST Certificates
- Company Registration Certificates
- PAN Documents
- Company Profile PDFs
- Contract Documents
- CPG Documents
- Images

Only URLs are stored in PostgreSQL.

---

## AI Service

Python

FastAPI

Scikit-learn

Responsibilities

- Risk Prediction
- Health Score
- Priority Ranking
- Anomaly Detection
- Recommendation Engine

The ML service communicates with Express using REST APIs.

---

# 3. Frontend Architecture

```
src/

components/

pages/

layouts/

hooks/

services/

contexts/

providers/

utils/

types/

assets/

styles/

routes/

constants/
```

Every feature should have its own folder.

Avoid large component files.

---

# 4. Backend Architecture

```
backend/

src/

controllers/

routes/

middlewares/

services/

repositories/

validators/

prisma/

config/

utils/

types/
```

Business logic belongs inside Services.

Routes should remain thin.

Controllers should only coordinate requests.

---

# 5. Authentication Flow

```
Login

↓

Firebase Authentication

↓

JWT Generated

↓

Express Middleware

↓

Verify JWT

↓

Fetch User from PostgreSQL

↓

Check Role

↓

Return Dashboard
```

Only ACTIVE users may access the system.

---

# 6. Registration Flow

```
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

Save Request

↓

Railway PostgreSQL

↓

Status

Pending Approval
```

No user may access the application before approval.

---

# 7. Admin Approval Flow

```
Registration Request

↓

Admin Dashboard

↓

Approve

↓

Status = ACTIVE

↓

Assign Role

↓

Email Notification

↓

User Login Enabled
```

Rejecting a request stores the rejection reason.

---

# 8. Dashboard Data Flow

```
Dashboard Page

↓

TanStack Query

↓

Backend API

↓

Prisma

↓

Railway PostgreSQL

↓

Return JSON

↓

Charts & Cards
```

Dashboard must never use hardcoded data.

---

# 9. Contract Flow

```
Create Contract

↓

Validate

↓

Store Database

↓

Create Audit Log

↓

Notify Users

↓

Refresh Dashboard
```

Every update generates an audit log.

---

# 10. CPG Lifecycle

```
Draft

↓

Submitted

↓

Verified

↓

Active

↓

Extended

↓

Released

↓

Expired
```

Every state change should be timestamped.

---

# 11. AI Workflow

```
Contract Data

↓

Backend

↓

ML Service

↓

Prediction

↓

Confidence

↓

Recommendation

↓

Database

↓

Dashboard
```

Predictions should be stored for historical analysis.

---

# 12. Document Flow

```
Upload

↓

Cloudinary

↓

File URL

↓

Railway PostgreSQL

↓

Preview

↓

Download
```

Never store files inside PostgreSQL.

---

# 13. Notification Flow

```
System Event

↓

Backend

↓

Notification Table

↓

User Notification Center

↓

Mark as Read
```

Future versions may support Email and SMS.

---

# 14. Report Flow

```
User Request

↓

Backend

↓

Database

↓

Generate PDF/Excel

↓

Download

↓

Store Report History
```

---

# 15. Security Layers

Authentication

↓

Authorization

↓

Input Validation

↓

Business Rules

↓

Database

↓

Audit Logs

Every request should be validated.

---

# 16. Error Handling

Every API should return:

```
success

message

data

errors
```

Errors should never expose server internals.

---

# 17. Logging

Log:

- Login
- Logout
- Registration
- Approval
- Contract Creation
- Contract Update
- CPG Update
- Document Upload
- Report Generation
- AI Prediction

---

# 18. Future Architecture

Version 2 may introduce:

- Redis
- Kafka
- GraphQL
- Docker
- Kubernetes
- API Gateway
- Microservices

The Version 1 architecture should be modular enough to support these technologies without major refactoring.

---

# 19. Architecture Principles

- Separation of Concerns
- Reusable Components
- Modular Services
- Thin Controllers
- Clean APIs
- Type Safety
- Secure Authentication
- Database-Driven UI
- AI as a Separate Service
- Enterprise Coding Standards

---

# 20. Golden Rule

Every page, chart, table, notification and AI insight must be driven by backend APIs and Railway PostgreSQL.

No component should rely on local static placeholder data.