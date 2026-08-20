# Phase 1 — Foundation Fixes & Bug Fixes

**Goal:** Fix known bugs, extend the database schema for remaining features, add the notifications API, and make the codebase runnable end-to-end.

## Bugs Fixed

| # | Bug | File Changed | Fix |
|---|-----|--------------|-----|
| 1 | `GET /api/stories` was a stub returning `501 Coming in Task #4` | `apps/api/src/routes/stories.js` | Full stories API implemented (create/list/approve/get/update/delete) |
| 2 | Navbar linked to `/stories` but no page existed → 404 | `apps/web/src/app/stories/page.js` (new), `apps/web/src/app/stories/new/page.js` (new) | Added Spotlight Wall + "Share Your Story" pages |
| 3 | `GET /api/referrals/me/received` selected `resumeUrl` on `User` (field didn't exist) → runtime crash | `apps/api/src/routes/referrals.js` | Removed invalid select; resume URL lives on `ReferralRequest.resumeUrl` |
| 4 | Alumni directory included `STUDENT` + `FACULTY` | `apps/api/src/routes/users.js` | Directory now filters `role: 'ALUMNI'` only |

## Schema Changes — `prisma/schema.prisma`

- **User**: added `resumeUrl String?` + relations `eventsCreated`, `rsvps`, `announcements`
- **New model `Event`**: title, description, date, location, mode (ONLINE/OFFLINE), coverImage, maxCapacity, createdBy
- **New model `EventRSVP`**: many-to-many User ↔ Event, unique `[eventId, userId]`
- **New model `Announcement`**: faculty posts (title, body, createdBy)

Migration: `prisma/migrations/20260815000000_init/migration.sql` (generated via `prisma migrate diff`). Apply with `npm run prisma:deploy` once Postgres is available.

## New Files Created

| File | Purpose |
|------|---------|
| `apps/api/src/routes/notifications.js` | Notification bell API (list, unread count, mark read, mark-all-read) |
| `apps/api/src/seed.js` | Idempotent seed: creates admin + demo alumni + demo student |
| `apps/web/src/app/stories/page.js` | Success Stories / Spotlight Wall (approved + featured) |
| `apps/web/src/app/stories/new/page.js` | Alumni story submission form |
| `prisma/migrations/migration_lock.toml` | Prisma migration lock |
| `apps/api/.env` | Local env config (DATABASE_URL placeholder, JWT, seed admin creds) |

## Modified Files

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added models + fields above |
| `apps/api/src/server.js` | Wired `app.use('/api/notifications', ...)` |
| `apps/api/src/routes/stories.js` | Stub → full implementation |
| `apps/api/src/routes/referrals.js` | Removed invalid `User.resumeUrl` select |
| `apps/api/src/routes/users.js` | Alumni directory filter = ALUMNI only |
| `apps/api/package.json` | Added `seed`, `prisma:deploy` scripts |
| `apps/api/.env.example` | Added `ADMIN_EMAIL` / `ADMIN_PASSWORD` |

## API Flows (how the code works now)

### Stories flow
```
POST /api/stories  (ALUMNI/ADMIN)  →  isApproved=false (pending)
        │
        ▼
GET  /api/stories/pending (ADMIN)  →  review queue
        │
        ▼
POST /api/stories/:id/approve (ADMIN)  →  isApproved=true (+ isFeatured)
        │                                   creates Notification (STORY_APPROVED)
        ▼
GET  /api/stories  →  public Spotlight Wall (approved only)
```

### Notifications flow
```
(referral/story events) → prisma.notification.create({userId, type, title, message, link})
                                │
        ┌───────────────────────┼──────────────────────────┐
        ▼                       ▼                          ▼
GET /api/notifications    GET /unread-count           PATCH /read-all
(list, paginated)         (badge number)              (or /:id/read)
```

## Verified

- `prisma validate` → schema valid ✅
- `prisma generate` → client generated ✅
- `next build` → 13 routes compile, `/stories` + `/stories/new` added ✅
- API smoke test: `/health` → ok, `/api/stories` wired, `/api/notifications` auth-protected ✅

## To Run (once Postgres is available)

```bash
cd apps/api
npm run prisma:deploy     # apply migrations
npm run seed              # create admin@college.edu / Admin@12345
npm run dev               # http://localhost:4000
```

## Next Up (Phase 2 — Engagement)

Success stories admin approval UI, Events + RSVP API/pages, Announcements, notification bell in navbar.
