# Local database login accounts

After applying the Prisma migration to Railway, run `npm run seed:accounts --prefix backend` with the Railway `DATABASE_URL` and a `JWT_SECRET` set. Passwords are stored only as secure hashes.

| Login type | Email | Password | Role | Home |
| --- | --- | --- | --- | --- |
| Admin | `admin@powergrid.com` | `Admin@2026` | ADMIN | `/admin/dashboard` |
| Project Engineer | `employee@powergrid.com` | `Employee@2026` | PROJECT_ENGINEER | `/engineer/dashboard` |
| Finance Officer | `finance@powergrid.com` | `Finance@2026` | FINANCE_OFFICER | `/finance/dashboard` |
| Contract Manager | `manager@powergrid.com` | `Manager@2026` | CONTRACT_MANAGER | `/contracts/dashboard` |
| Auditor | `auditor@powergrid.com` | `Auditor@2026` | AUDITOR | `/audit/dashboard` |
| Contractor | `contractor@powergrid.com` | `Contractor@2026` | CONTRACTOR | `/contractor/dashboard` |
| Viewer | `viewer@powergrid.com` | `Viewer@2026` | VIEWER | `/viewer/dashboard` |

Change these demo passwords before giving the application to real users.
