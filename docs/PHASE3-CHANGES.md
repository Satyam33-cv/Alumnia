# Phase 3 — Admin Suite

**Goal:** Analytics dashboard, alumni verification, bulk CSV import.

## New Files Created

| File | Purpose |
|------|---------|
| `apps/api/src/routes/admin.js` | Admin-only routes: stats, user list, verify, CSV import |
| `apps/web/src/app/admin/dashboard/page.js` | Analytics: KPI cards, users-by-role bars, referrals-by-status, recent activity |
| `apps/web/src/app/admin/users/page.js` | Browse users + verify/unverify alumni (filters + pagination) |
| `apps/web/src/app/admin/import/page.js` | CSV upload UI + import summary + downloadable sample template |

## Modified Files

| File | Change |
|------|--------|
| `apps/api/src/server.js` | Wired `/api/admin` (router self-guards with `authenticate` + `requireRole('ADMIN')`) |
| `apps/api/src/routes/admin.js` route guard | All admin endpoints protected at router level |
| `apps/api/package.json` | Added `csv-parse` dependency |
| `apps/api/.env.example` | Added `CSV_TEMP_PASSWORD` |
| `apps/web/src/app/admin/page.js` | Landing now links to Dashboard, Verify, Stories, Import |

## API Endpoints (all ADMIN-only)

```
GET   /api/admin/stats                        # platform analytics
GET   /api/admin/users?role=&verified=&search=  # paginated user list
PATCH /api/admin/users/:id/verify             # { verified: boolean }
POST  /api/admin/import-csv                   # multipart 'file' (CSV)
```

## CSV Import Workflow

```
Admin uploads CSV (multipart 'file')
        │
        ▼
multer (memory storage, 5 MB limit)  →  csv-parse (columns: true)
        │
        ▼
For each row: validate name + email format
        ├── duplicate email  →  skipped (kept list)
        ├── invalid/missing  →  failed (with row number + reason)
        └── valid            →  create User (role ALUMNI, isVerified=false,
                                 bcrypt temp password from CSV_TEMP_PASSWORD)
        │
        ▼
Response: { total, imported, skipped, failed, tempPassword }
+ welcome-email placeholder logged (SendGrid wired in Phase 4)
```

## Verified

- All API JS files pass `node --check` ✅
- `next build` → 22 routes; new: `/admin/dashboard`, `/admin/users`, `/admin/import` ✅
- Smoke test: `/api/admin/stats`, `/users`, `/import-csv` all return 401 without an admin token ✅

## Notes

- Admin router uses `router.use(authenticate, requireRole('ADMIN'))` — every admin endpoint is protected.
- CSV import is DB-dependent; end-to-end test requires Postgres (no local DB present).
- Welcome emails are a Phase 4 concern (SendGrid). The import currently creates accounts + logs a placeholder.

## Next Up (Phase 4 — Comms & Files)

SendGrid email (welcome/activation + referral notifications), Twilio WhatsApp alerts, resume file upload via Cloudinary/S3.
