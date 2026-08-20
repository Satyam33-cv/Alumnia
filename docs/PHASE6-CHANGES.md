# Phase 6 — Mobile App & Deployment

**Goal:** Ship Alumnia as a React Native (Expo) app and provide a
production deployment playbook.

## What was built

### React Native / Expo app — `apps/mobile/`
- `package.json` — Expo SDK 52, React 18.3, React Native 0.76; AsyncStorage,
  `@expo/vector-icons`, `expo-status-bar`; dev deps `@babel/cli`,
  `babel-preset-expo`.
- `app.json` — app config, API URL extra, Android package
  `com.alumnia.app`, iOS bundle identifier.
- `eas.json` — EAS Build profiles (`development` / `preview` / `production`)
  with `API_URL` injected per profile.
- `babel.config.js`, `.env.example`, `.gitignore`, generated `assets/icon.png`.
- `src/config.js` — API base URL resolution:
  `process.env.API_URL` → Android emulator `10.0.2.2:4000` → `localhost:4000`.
- `src/theme.js` — shared color palette, spacing, radius.
- `src/api.js` — JWT-aware fetch wrapper (AsyncStorage token, 401 logout) +
  multipart resume upload helper.
- `src/context/AuthContext.js` — login/register/logout, session restore,
  `/api/users/me` refresh.
- `src/components/ui.js` — Screen, Button, Input, Card, Tag, Avatar, ErrorBox,
  Empty.
- `src/screens/` — Login, Register (role selector), Jobs (referral request
  modal), Stories (submit modal), Events (RSVP modal), Referrals (sent/received
  tabs + status actions), AI Matches (top-5 + re-match), Profile (edit +
  logout).
- `App.js` — auth gate (splash while restoring session) + bottom tab
  navigation (state-based, no react-navigation dependency) + floating
  "AI Matches" button for students.

### Infrastructure / deployment
- `apps/api/Procfile` — `web: node src/server.js` (Render).
- `apps/api/.env.production.example` — full production env matrix (Supabase
  direct URL, fresh JWT_SECRET, WEB_URL, Cloudinary/SendGrid/Twilio/OpenAI).
- `docs/DEPLOYMENT.md` — step-by-step: Supabase (managed Postgres only),
  Railway/Render API, Vercel web, EAS Build → Google Play / TestFlight, env
  matrix, troubleshooting.
- Root `.gitignore` added (node_modules, .env, build outputs, uploads).

## Design decisions
- **Supabase = Postgres only.** No Supabase Auth/Storage/Realtime — the app
  keeps its own JWT auth and Cloudinary uploads, staying portable.
- **API on Railway/Render** (long-running Node), **web on Vercel**, **mobile
  via EAS Build** → Play Store / App Store.
- **`API_URL` via env** lets the same code run in Expo Go (localhost),
  emulator (10.0.2.2), or production (EAS-injected HTTPS URL).
- **Tab navigation in pure state** — no react-navigation dependency, keeping
  the dependency tree small.

## Verification
- 14/14 mobile files compile under `babel-preset-expo`.
- `npx expo export --platform android` bundles successfully
  (638 modules, `Exported: dist`).
- Fixed a JSX syntax bug (extra closing paren in the list ternary) in
  `EventsScreen`, `JobsScreen`, `StoriesScreen` — caught by the export check.

## Demo (mobile)
1. `cd apps/mobile && npm install && npx expo start`
2. Scan the QR with **Expo Go** (App Store / Play Store).
3. Log in with a seed account (see README) — the app talks to your local API.

## Next steps
- Register an EAS account and run `eas build` for real device installs.
- Optionally swap the state-based tab bar for `@react-navigation/bottom-tabs`
  for deep-linking/back gesture polish.
