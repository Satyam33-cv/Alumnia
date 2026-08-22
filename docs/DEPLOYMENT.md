# Deployment Guide — PRO ALUMN

This guide covers taking PRO ALUMN from local development to production:
managed PostgreSQL (Supabase), the REST API (Railway or Render), the web app
(Vercel), and the mobile app (Expo Go → EAS Build → app stores).

## Architecture Overview

```
┌─────────────────────┐     ┌──────────────────────────┐
│  React Native app    │     │  Next.js web app         │
│  (Expo / EAS Build)  │     │  (Vercel)                │
└──────────┬──────────┘     └────────────┬─────────────┘
           │ HTTPS (REST + JWT)          │ HTTPS (REST + JWT)
           ▼                             ▼
┌───────────────────────────────────────────────────────┐
│            Express API  (Railway / Render)            │
│  Auth · Jobs · Referrals · Stories · Events · Admin   │
│  Uploads (Cloudinary) · Notify (SendGrid/Twilio)      │
│  AI Matching (pgvector + OpenAI)                      │
└──────────────────────┬────────────────────────────────┘
                       │ Prisma
                       ▼
┌───────────────────────────────────────────────────────┐
│   Supabase PostgreSQL  (managed; pgvector enabled)     │
└───────────────────────────────────────────────────────┘
```

**Design decision:** Supabase is used ONLY as a managed Postgres database.
PRO ALUMN keeps its own JWT auth, file uploads (Cloudinary), and
notifications (SendGrid/Twilio). Do not adopt Supabase Auth/Storage/Realtime —
this keeps the app portable and avoids lock-in.

---

## 1. Database — Supabase

1. Create a project at [supabase.com](https://supabase.com) (Free tier is fine).
2. Note the project ref (the `xxxx` in `db.xxxx.supabase.co`).
3. Set a strong database password (keep it).
4. In **Project Settings → Database → Connection string**, copy the
   **direct connection** URI (port `5432`). Prisma migrations require the
   direct connection, not the pooled (`:6543`) one.

```
postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

5. Apply the schema + migrations and seed demo data:

```bash
cd apps/api
# set DATABASE_URL to the Supabase URI in apps/api/.env
npm run prisma:deploy     # applies prisma/migrations/* (incl. pgvector extension)
npm run seed              # creates admin/alumni/student demo users + embeddings
```

> The API server itself can use either the direct or pooled URL; Prisma
> migrations and `psql` must use the direct URL.

---

## 2. REST API — Railway (recommended) or Render

### Railway
1. [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
   repo, root dir = `apps/api`.
2. **Variables** (see `apps/api/.env.production.example`):
   `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `WEB_URL`,
   `CLOUDINARY_*` (required in prod), `SENDGRID_API_KEY`, `TWILIO_*`,
   `OPENAI_API_KEY`, `CSV_TEMP_PASSWORD`, `PORT=4000`.
3. Start command: `npm start` (runs `node src/server.js`).
4. Add a TCP domain (Railway gives `*.up.railway.app` for free) and copy the
   public HTTPS URL — the mobile app will point at it.

### Render
1. [render.com](https://render.com) → **New → Web Service** → repo, root dir
   `apps/api`.
2. Runtime: Node 18+, Build Command `npm install`, Start Command
   `npm start`.
3. Set the same env vars. The checked-in `apps/api/Procfile`
   (`web: node src/server.js`) is honored automatically.

**Health check:** `GET /api/health` should return `{ ok: true }`.

---

## 3. Web App — Vercel

1. [vercel.com](https://vercel.com) → import the repo → root directory
   `apps/web`.
2. Set `NEXT_PUBLIC_API_URL=https://<your-api-url>`.
3. Deploy. CORS on the API already allows the Vercel origin via `WEB_URL`.

---

## 4. Mobile App — Expo → EAS Build → Stores

### 4.1 Development (Expo Go)
```bash
cd apps/mobile
npm install
npx expo start          # scan QR with Expo Go on your phone
```
By default the app calls `http://localhost:4000` (iOS sim) /
`http://10.0.2.2:4000` (Android emulator). For a physical phone, set
`API_URL` to your machine's LAN IP or the deployed API:
```bash
$env:API_URL="http://192.168.1.50:4000"; npx expo start
```

### 4.2 Production build (EAS Build)
```bash
cd apps/mobile
npm install -g eas-cli
eas login
eas build:configure      # uses the checked-in eas.json
eas build --platform android --profile production   # → APK/AAB
eas build --platform ios --profile production       # → IPA (requires Apple account)
```
`eas.json` already injects `API_URL` (your deployed API) into the
production build, so the shipped app talks to the real backend, not localhost.

### 4.3 Distribution
- **Android:** upload the `.aab` to [Google Play Console](https://play.google.com/console)
  → $25 one-time fee → Internal testing → Production.
- **iOS:** TestFlight (no fee) via App Store Connect, then App Review →
  App Store ($99/year developer program).

**Required in production:** `CLOUDINARY_*` on the API. Local file storage
(`apps/api/uploads/`) is wiped on every redeploy, so resumes must go to
Cloudinary.

---

## 5. Environment Variable Matrix

| Variable | API | Web | Mobile | Notes |
|---|---|---|---|---|
| `DATABASE_URL` | ✅ | | | Supabase direct URI |
| `JWT_SECRET` | ✅ | | | Generate fresh for prod |
| `PORT` | ✅ | | | Railway/Render default 4000 |
| `NODE_ENV` | ✅ | | | `production` |
| `WEB_URL` | ✅ | | | Deployed Vercel URL (CORS) |
| `NEXT_PUBLIC_API_URL` | | ✅ | | Web → API |
| `API_URL` | | | ✅ | EAS-injected in production build |
| `CLOUDINARY_CLOUD_NAME/KEY/SECRET` | ✅ | | | Required |
| `SENDGRID_API_KEY` / `EMAIL_FROM` | ✅ | | | Optional (fallback logs) |
| `TWILIO_ACCOUNT_SID/AUTH_TOKEN/WHATSAPP_FROM` | ✅ | | | Optional (fallback logs) |
| `OPENAI_API_KEY` | ✅ | | | Optional (local embedding fallback) |
| `CSV_TEMP_PASSWORD` | ✅ | | | Temp password for CSV imports |

---

## 6. Demo Accounts (seeded)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@college.edu` | `Admin@12345` |
| Alumni | `alumni@college.edu` | `Alumni@12345` |
| Student | `student@college.edu` | `Student@12345` |

---

## 7. Troubleshooting

- **Prisma migrate fails:** the connection must be the Supabase **direct**
  (port 5432) URL, not the transaction pooler (6543).
- **Mobile can't reach the API:** the phone must be on a network that can
  reach the API URL; use the deployed HTTPS URL, never `localhost`.
- **Uploads 404 after redeploy:** Cloudinary not configured — set the
  `CLOUDINARY_*` variables and re-upload.
- **AI matching returns empty:** run `POST /api/matching/sync` (admin) once so
  embeddings exist; without OpenAI the local deterministic fallback is used.
