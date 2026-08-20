# Phase 2 — Engagement Features

**Goal:** Add Events + RSVP, Announcements, admin story approval UI, and the notification bell.

## New Files Created

| File | Purpose |
|------|---------|
| `apps/api/src/routes/events.js` | Events CRUD + RSVP workflow |
| `apps/api/src/routes/announcements.js` | Faculty/admin announcements CRUD |
| `apps/web/src/components/NotificationBell.js` | Bell with unread badge + dropdown |
| `apps/web/src/app/admin/page.js` | Admin dashboard landing (role-guarded) |
| `apps/web/src/app/admin/stories/page.js` | Story review queue: approve / approve & feature / reject |
| `apps/web/src/app/events/page.js` | Events list (upcoming/all tabs) + inline RSVP |
| `apps/web/src/app/events/new/page.js` | Create event form (ADMIN/ALUMNI/FACULTY) |
| `apps/web/src/app/events/[id]/page.js` | Event detail, RSVP, attendee list, organizer |
| `apps/web/src/app/announcements/page.js` | Announcements list |
| `apps/web/src/app/announcements/new/page.js` | Post announcement form (FACULTY/ADMIN) |

## Modified Files

| File | Change |
|------|--------|
| `apps/api/src/middleware/auth.js` | Added `optionalAuthenticate` (sets `req.user` if valid token, never fails) |
| `apps/api/src/server.js` | Wired `/api/events` + `/api/announcements` routes |
| `apps/web/src/components/Navbar.js` | Added Events link, Admin link (ADMIN only), NotificationBell; nav links hidden on small screens |
| `apps/web/src/app/page.js` | Quick Access grid now includes Events, Stories, Announcements |

## Schema (already in Phase 1 migration — no new migration)

`Event`, `EventRSVP`, `Announcement` models were added to the schema + initial migration in Phase 1. This phase only adds API + UI on top of them.

## API Flows

### Events + RSVP
```
POST /api/events (ADMIN/ALUMNI/FACULTY) → create event
GET  /api/events?upcoming=true          → list (asc by date) + rsvp count
GET  /api/events/:id (optional auth)    → detail + attendees + hasRsvp flag
POST /api/events/:id/rsvp (auth)        → create RSVP (unique [eventId,userId])
                                            · rejects past events
                                            · rejects full events (maxCapacity)
                                            · notifies organizer
DELETE /api/events/:id/rsvp (auth)      → cancel RSVP
PATCH/DELETE /api/events/:id            → organizer or admin only
```

### Announcements
```
POST /api/announcements (FACULTY/ADMIN) → post
GET  /api/announcements                 → list (newest first) + author
GET  /api/announcements/:id             → detail
PATCH/DELETE /api/announcements/:id     → author or admin only
```

### Notification Bell
```
Component mounts (auth user) → GET /api/notifications/unread-count  (poll every 30s)
Open dropdown                → GET /api/notifications?limit=12
Click notification          → PATCH /api/notifications/:id/read + navigate to n.link
"Mark all read"             → PATCH /api/notifications/read-all
```

## Verified

- All API JS files pass `node --check` ✅
- `next build` → 19 routes compile; new: `/admin`, `/admin/stories`, `/events`, `/events/new`, `/events/[id]`, `/announcements`, `/announcements/new` ✅
- API smoke test: events + announcements wired; RSVP + announcements POST are auth-protected (401) ✅

## Notes

- **No new migration needed** — Event/RSVP/Announcement tables are already in `20260815000000_init`.
- Events list `/api/events` returns `500` until Postgres is configured (expected — no DB running).
- `optionalAuthenticate` is used on `GET /api/events/:id` so the `hasRsvp` flag is computed server-side for logged-in users while the page stays public.

## Next Up (Phase 3 — Admin Suite)

Alumni verification, admin analytics dashboard, CSV import for alumni data, job moderation.
