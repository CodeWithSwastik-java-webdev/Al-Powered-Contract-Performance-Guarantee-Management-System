# Missing Feature Report

## Existing foundation

- React/Vite frontend, Express/Prisma backend, Firebase token middleware, RBAC primitives, and a broadly capable PostgreSQL schema are present.
- Contract, CPG, dashboard, registration-request, audit, notification, and document models already exist.

## High-impact gaps found

- Registration was a placeholder wizard that saved local drafts and submitted no information; approval did not activate a Firebase-linked application user.
- Login did not surface account states or a production-grade recovery flow.
- Registration review had no route-level admin restriction and its service was not exported, preventing compilation.
- Cloudinary upload, document APIs, notification center, audit-log UI/API, and full contract/CPG create-edit-delete workflows are incomplete.
- The dashboard and navigation contain hardcoded presentation data, contrary to the database-driven requirement.
- Both applications initially failed TypeScript validation due to missing dependency/type errors and incomplete repository APIs.

## Current implementation focus

Authentication and approval are being completed first: a Firebase-linked registration request, server validation, administrator-only review, approval-driven ACTIVE user creation, and a database-backed registration wizard.
