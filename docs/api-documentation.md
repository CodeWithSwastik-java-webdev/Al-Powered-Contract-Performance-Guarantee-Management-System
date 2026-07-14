# API Documentation

## Response Format
- Success responses should return clear JSON payloads with stable shapes.
- List endpoints should support pagination metadata when relevant.

## Error Format
- Validation errors should identify the field and message.
- Authorization errors should clearly indicate access failure.
- Not found and conflict cases should use distinct responses.

## Endpoints

### Authentication
- POST /login
- POST /register
- POST /logout
- GET /me

### Users
- GET /users
- GET /users/:id
- POST /users
- PATCH /users/:id
- PATCH /users/:id/role

### Contracts
- GET /contracts
- POST /contracts
- GET /contracts/:id
- PATCH /contracts/:id
- DELETE /contracts/:id

### CPG
- GET /cpgs
- POST /cpgs
- GET /cpgs/:id
- PATCH /cpgs/:id
- POST /cpgs/:id/verify
- POST /cpgs/:id/extend
- POST /cpgs/:id/release

### Dashboard
- GET /dashboard
- GET /dashboard/stats
- GET /dashboard/recent-activity
- GET /dashboard/charts

### Documents
- GET /documents
- POST /documents
- GET /documents/:id
- DELETE /documents/:id

### Notifications
- GET /notifications
- PATCH /notifications/:id/read
- PATCH /notifications/read-all

### Audit
- GET /audit-logs
- GET /audit-logs/:id

### AI
- POST /predict
- GET /ai/health-score/:id
- GET /ai/recommendations/:id

### Health
- GET /health

## Endpoint Notes
- Pagination, filters, and sorting should be documented where supported.
- Route protection should be noted for each role-sensitive endpoint.
- Request and response examples should be added as implementation stabilizes.