# Database Design

## ER Diagram
- Maintain the ER diagram as the source of truth for domain relationships.
- Keep the diagram aligned with Prisma schema changes.

## Tables
- Users
- Roles and permissions
- Contractors
- Contracts
- CPGs
- Documents
- Notifications
- Audit logs
- Risk assessments
- ML predictions

## Relations
- A contract can have many CPG records.
- A contract can have many documents.
- A user can be assigned a role and participate in audits.
- Audit records should reference the affected entity.

## Indexes
- Index foreign keys and frequently filtered status fields.
- Index expiry and deadline columns for operational queries.

## Enums
- Keep enum values aligned with lifecycle and permission rules.
- Update documentation whenever lifecycle states change.

## Audit Design
- Store who changed what, when, and why where possible.
- Preserve enough detail for compliance and operational review.

## Notification Design
- Store the notification type, target user, read state, and reference entity.
- Keep notifications queryable by recency and priority.

## Role Design
- Map roles to permissions explicitly.
- Enforce role checks in application logic, not only in the UI.

## Prisma Notes
- Prisma schema updates must remain consistent with service expectations.
- Document any migration-sensitive changes.

## Seed Strategy
- Seed realistic reference data first.
- Use idempotent logic where possible.
- Seed enough records to exercise dashboards, tables, and AI views.