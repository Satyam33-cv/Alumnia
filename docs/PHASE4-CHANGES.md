# Phase 4 — Comms & Files

**Goal:** Transactional email (SendGrid), WhatsApp alerts (Twilio), resume file uploads (Cloudinary with local fallback).

## New Files Created

| File | Purpose |
|------|---------|
| `apps/api/src/services/email.js` | SendGrid wrapper: welcome, referral status, new-referral, story-approved templates. Logs placeholder when `SENDGRID_API_KEY` is absent |
| `apps/api/src/services/whatsapp.js` | Twilio WhatsApp wrapper (E.164 phone validation, placeholder when unconfigured) |
| `apps/api/src/services/notify.js` | Central fan-out: in-app notification + optional email + WhatsApp in one call |
| `apps/api/src/routes/uploads.js` | `POST /api/uploads/resume` (multer disk storage, 5 MB, PDF/DOC/DOCX/TXT/JPG/PNG/WEBP). Cloudinary when configured, else local `apps/api/uploads/` |
| `apps/api/.gitignore` | Excludes `uploads/` |

## Modified Files

| File | Change |
|------|--------|
| `apps/api/src/server.js` | Wired `/api/uploads` router + static `/uploads` file serving |
| `apps/api/src/routes/referrals.js` | New referral request → in-app + email + WhatsApp to alumni; status change → email to student (+ WhatsApp on HIRED) |
| `apps/api/src/routes/stories.js` | Story approval → in-app + email to alumni |
| `apps/api/src/routes/events.js` | New RSVP → in-app to organizer (via notify service) |
| `apps/api/src/routes/admin.js` | CSV import now sends real welcome emails (replaces placeholder) |
| `apps/api/src/routes/users.js` | `resumeUrl` editable on `/users/me` |
| `apps/api/package.json` | Added `@sendgrid/mail`, `twilio`, `cloudinary` |
| `apps/api/.env.example` | Added comms + storage vars (all optional) |
| `apps/web/src/lib/api.js` | New `api.upload(path, formData)` helper (FormData-aware, no JSON Content-Type) |
| `apps/web/src/app/jobs/[id]/page.js` | Referral modal: file upload (with link fallback) instead of manual URL only |
| `apps/web/src/app/profile/page.js` | Resume upload + "view current resume" link |

## Notification Channels

| Event | In-app | Email | WhatsApp |
|-------|:---:|:---:|:---:|
| New referral request (→ alumni) | ✅ | ✅ | ✅ |
| Referral accepted / referred / rejected (→ student) | ✅ | ✅ | — |
| Referral hired (→ student) | ✅ | ✅ | ✅ |
| Story approved (→ alumni) | ✅ | ✅ | — |
| New RSVP (→ organizer) | ✅ | — | — |
| CSV import welcome (→ imported alumni) | — | ✅ | — |

## Configuration (all optional — features degrade gracefully)

```
SENDGRID_API_KEY=""                      # emails → console placeholders
EMAIL_FROM="Alumnia <no-reply@...>"
TWILIO_ACCOUNT_SID=""                    # WhatsApp → console placeholders
TWILIO_AUTH_TOKEN=""
TWILIO_WHATSAPP_FROM="whatsapp:+14155552671"
CLOUDINARY_CLOUD_NAME=""                 # resume uploads → local apps/api/uploads/
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## Verified

- All 17 API JS files pass `node --check` ✅
- `next build` → compiled successfully (22 routes) ✅
- Server boots with all new deps wired ✅
- `POST /api/uploads/resume` → 401 without token ✅
- Upload e2e (JWT + real PDF): `201` → URL returned → static fetch `200` ✅
- `/health` → 200 ✅

## Notes

- Full email/WhatsApp delivery requires real API keys; the placeholder mode logs every message so flows are testable with zero config.
- User profiles need a phone in E.164 format (e.g. `+919876543210`) for WhatsApp.
- Public API responses never expose `resumeUrl` (privacy) — resumes only reach the alumni accepting a referral.

## Next Up (Phase 5 — AI Smart Matching)

"Top 5 Alumni for You" using pgvector embeddings (OpenAI or local all-MiniLM) + optional story/article author matching.
