# Setup Guide — Run Alumnia Locally (Step by Step)

This guide gets all three apps working on your machine:
**API → Web → Mobile (Expo)**, backed by a free cloud PostgreSQL.

> No Docker and no local PostgreSQL are required. We use **Supabase** (free
> tier) purely as a hosted PostgreSQL database.

---

## Step 0 — What you need (all free)

| Item | Where | Cost |
|---|---|---|
| Node.js 18+ | nodejs.org | Free |
| Supabase account | supabase.com | Free tier |
| Expo Go app | Play Store / App Store (on your phone) | Free |
| (Optional) Android Studio emulator | developer.android.com/studio | Free |

Your machine already has: Node v26.4.0, npm 11.18.0, and all `node_modules`
installed for `apps/api`, `apps/web`, `apps/mobile`.

---

## Step 1 — Create the cloud database (Supabase)

1. Go to [supabase.com](https://supabase.com) → **Sign in** (GitHub/Google).
2. **New project** → choose an org, name it `alumnia`, set a strong
   **Database Password** (save it — you can't recover it later).
3. Region: pick the closest (e.g. `Asia South (Mumbai)`). Click **Create
   project** and wait ~2 minutes for provisioning.
4. In the dashboard, go to **Project Settings → Database → Connection
   string** and copy the **URI** under "Direct connection" (port `5432`):

```
postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

> Use the **direct (5432)** connection for Prisma, not the pooler (6543).
> The default `postgres` role/DB is fine.

---

## Step 2 — Point the API at your database

Edit `apps/api/.env` (it already exists — update the values):

```dotenv
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
JWT_SECRET="(your-long-random-string)"
PORT=4000
NODE_ENV=development
WEB_URL="http://localhost:3000"
ADMIN_EMAIL="admin@college.edu"
ADMIN_PASSWORD="Admin@12345"
CSV_TEMP_PASSWORD="Welcome@2026"
```

Generate a JWT secret (PowerShell):

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Leave `SENDGRID_*`, `TWILIO_*`, `CLOUDINARY_*`, `OPENAI_API_KEY` empty for now
— every feature falls back to console/local mode.

---

## Step 3 — Apply migrations + seed demo data

Run these inside `apps/api`:

```powershell
cd apps/api

npm run prisma:deploy     # applies all migrations (incl. pgvector extension)
npm run prisma:generate   # regenerates the Prisma Client
npm run seed              # creates admin / alumni / student accounts + embeddings
```

Expected output ends with:

```
✅ Seed complete. Login with:
   Admin   → admin@college.edu / Admin@12345
   Alumni  → alumni@college.edu / Alumni@12345
   Student → student@college.edu / Student@12345
```

> If `prisma:deploy` complains about the schema path — the scripts were fixed
> to point at `../../prisma/schema.prisma`.

---

## Step 4 — Start the API server

Still in `apps/api`:

```powershell
npm run dev        # nodemon → http://localhost:4000
```

Keep this terminal open. Verify in a second terminal:

```powershell
Invoke-RestMethod http://localhost:4000/health
# → status : ok, service : alumni-api
```

Test login directly:

```powershell
$body = '{"email":"student@college.edu","password":"Student@12345"}'
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/auth/login -ContentType "application/json" -Body $body
# → returns user + token
```

---

## Step 5 — Start the web app

Open a **new terminal**:

```powershell
cd apps/web
New-Item .env -Force; Set-Content .env "NEXT_PUBLIC_API_URL=http://localhost:4000"
npm run dev        # → http://localhost:3000
```

Open http://localhost:3000 in your browser and log in with any demo account.

---

## Step 6 — Start the mobile app (Expo)

Open a **new terminal**:

```powershell
cd apps/mobile
npx expo start
```

Then pick your device:

| Device | What to do |
|---|---|
| **Android emulator** | Press `a` in the Expo terminal (or scan QR in emulator) |
| **iOS simulator** | Press `i` (macOS only) |
| **Physical phone** | Install **Expo Go**, scan the QR code — phone and PC must be on the same Wi-Fi |

### API URL for the mobile app

The app auto-picks an API URL in `apps/mobile/src/config.js`:

- **Android emulator** → `http://10.0.2.2:4000` (reaches your PC's localhost) ✅ no config needed
- **iOS simulator / web** → `http://localhost:4000` ✅ no config needed
- **Physical phone** → must use your PC's LAN IP, not localhost:

```powershell
$env:API_URL="http://192.168.1.50:4000"   # your PC's LAN IP
npx expo start --clear
```

> Find your LAN IP with `ipconfig` (look for "IPv4 Address"). Also allow
> Windows Firewall to let Node.js through on port 4000.

### Login in the mobile app

Use the seeded accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@college.edu` | `Admin@12345` |
| Alumni | `alumni@college.edu` | `Alumni@12345` |
| Student | `student@college.edu` | `Student@12345` |

---

## Step 7 — Common errors & fixes

| Symptom | Fix |
|---|---|
| Login → "Network request failed" | API not running → start `npm run dev` in `apps/api` and confirm `http://localhost:4000/health` |
| Android emulator can't reach API | Must use `10.0.2.2`, not `localhost` (already default) |
| Physical phone can't reach API | Use `API_URL=http://<PC-LAN-IP>:4000`, same Wi-Fi, firewall open |
| `P3006` / "connection refused" from Prisma | Wrong `DATABASE_URL` — use Supabase **direct (5432)** URI in `apps/api/.env` |
| Migrations fail "schema not found" | Run via `npm run prisma:deploy` (scripts now include `--schema`) |
| AI matches empty | No data yet — jobs/referrals seed; `POST /api/matching/sync` (admin) recomputes embeddings |
| Resumes 404 later | Normal in local dev (local files). Set `CLOUDINARY_*` when you deploy |

---

## Full production deployment

When you're ready to publish (API on Railway/Render, web on Vercel, mobile via
EAS Build → stores), follow **`docs/DEPLOYMENT.md`**.
