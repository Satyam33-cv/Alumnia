# Alumnia

Alumnia (formerly AlumniConnect) is a centralized digital platform that bridges the gap between educational institutions and their alumni network. It unifies fragmented alumni data into a single, smart, searchable database — helping alumni find each other, share opportunities, and stay connected.

## Features

- **Directory** — searchable alumni profiles with ID-based detail routes
- **Jobs** — browse roles, view details, and request introductions
- **Events** — event listings with detail pages and RSVP flow
- **Requests** — referral board with pending, accepted, declined, and completed states
- **Dashboard** — personalized greeting and at-a-glance activity
- **Admin** — metrics command center with CSV import UX
- **Auth** — login/register flows with validation and session persistence

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript (strict)
- Tailwind CSS 3
- React 18
- lucide-react icons
- Axios (typed `apiFetch` wrapper)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command        | Description         |
| -------------- | ------------------- |
| `npm run dev`  | Start dev server    |
| `npm run build`| Production build    |
| `npm run lint` | Run ESLint          |

## Project structure

```
app/             App Router pages (auth, dashboard, directory, jobs, events, requests, admin)
components/      Feature components and ui/ primitives (Card, Button, Field, Badge, …)
lib/             Design tokens, typed API client, hooks, mock data, auth helpers
docs/            Design review, UI plan, and per-phase records
```

## Docs

- [`docs/DESIGN_REVIEW_AND_PLAN.md`](docs/DESIGN_REVIEW_AND_PLAN.md) — architecture decisions and the phase-by-phase build log (Phases 0–10)
- [`docs/UI_PLAN.md`](docs/UI_PLAN.md) — product direction and UI principles
- [`docs/phases/`](docs/phases/) — per-phase records

## Status

The platform has been fully upgraded to a full-stack production application (Phases 1-6 Full-Stack Upgrade).
- **Frontend**: Next.js App Router UI.
- **Backend**: Express API with Supabase PostgreSQL and Prisma ORM.
- **AI Matching**: pgvector embeddings for smart alumni recommendations.

To run the full stack locally:
1. Ensure `DATABASE_URL` is set in `apps/api/.env`.
2. Run `npm install` in the root.
3. Run `npm run dev` to start both the frontend (port 3000) and backend (port 4000) concurrently.
