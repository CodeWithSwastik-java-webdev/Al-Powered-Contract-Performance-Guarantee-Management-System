# Local database login accounts

After applying the Prisma migration to Railway, run `npm run seed:accounts --prefix backend` with the Railway `DATABASE_URL` and a `JWT_SECRET` set. Passwords are stored only as secure hashes.

| Login type | Email | Password | Role |
| --- | --- | --- | --- |
| Admin | `admin@powergrid.com` | `Admin@2026` | ADMIN |
| Employee | `employee@powergrid.com` | `Employee@2026` | ENGINEER |
| Contractor | `contractor@powergrid.com` | `Contractor@2026` | VIEWER |
| Finance | `finance@powergrid.com` | `Finance@2026` | FINANCE |
| Viewer | `viewer@powergrid.com` | `Viewer@2026` | VIEWER |

Change these demo passwords before giving the application to real users.
