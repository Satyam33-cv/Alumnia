# Phase 5 — AI Smart Matching

**Goal:** pgvector-powered "Top 5 Alumni for You" for students.

## How It Works

```
User profile → profileText() → embedding (384-dim)
     │
     ▼
PostgreSQL "User"."embedding"  vector(384)   [HNSW cosine index]
     │
     ▼
Student logs in → /api/matching/top-alumni
     └─> cosine distance (<=>) vs all verified alumni → top 5 + match %
```

Embeddings come from **OpenAI `text-embedding-3-small` (dims=384)** when `OPENAI_API_KEY` is set.
Without a key, a deterministic **local hashing embedding** (words + char 2-grams, L2-normalized)
keeps the entire pipeline testable offline. Verified: related profiles score ~0.84 cosine similarity,
unrelated ~0.03.

## New Files Created

| File | Purpose |
|------|---------|
| `apps/api/src/services/embeddings.js` | `generateEmbedding()` (OpenAI w/ local fallback), `profileText()` builder, 384-dim |
| `apps/api/src/routes/matching.js` | `GET /top-alumni`, `POST /sync` (admin), `POST /sync-me` |
| `prisma/migrations/20260815000001_phase5_smart_matching/migration.sql` | `CREATE EXTENSION vector`, `User.skills/interests`, `User.embedding vector(384)`, HNSW index |
| `apps/web/src/app/matching/page.js` | Student page: top 5 cards with match %, skills chips, View Profile, Re-match |

## Modified Files

| File | Change |
|------|--------|
| `prisma/schema.prisma` | `previewFeatures = ["postgresqlExtensions"]`, `extensions = [vector]`, `User.skills`, `User.interests`, `User.embedding Unsupported("vector(384)")?` |
| `apps/api/src/server.js` | Wired `/api/matching` |
| `apps/api/src/seed.js` | Embeds all seeded users after creation |
| `apps/api/src/routes/users.js` | `skills` / `interests` editable + returned on profile |
| `apps/web/src/components/Navbar.js` | "AI Matches" link (students) |
| `apps/web/src/app/profile/page.js` | Skills + Interests fields (feeds matching) |
| `apps/web/src/app/admin/dashboard/page.js` | "Sync AI embeddings" button + result summary |
| `apps/api/.env.example` | Added `OPENAI_API_KEY` (optional) |
| `prisma/migrations/20260815000000_init/migration.sql` | Re-encoded UTF-8 (was UTF-16 from legacy PS writing) |

## API Endpoints

```
GET   /api/matching/top-alumni?limit=5   # STUDENT — top N alumni by similarity
POST  /api/matching/sync                 # ADMIN — re-embed all active users
POST  /api/matching/sync-me              # ANY user — re-embed just themselves
```

## Verified

- Prisma schema valid + client regenerated (postgresqlExtensions preview) ✅
- All 19 API JS files pass `node --check` ✅
- `next build` → compiled, `/matching` route present ✅
- Embedding service: 384-dim, L2 norm = 1, related 0.84 vs unrelated 0.03 ✅
- Auth guards: `/top-alumni` GET→401, `/sync` POST→401, `/sync-me` POST→401 ✅
- Migration diff shows `CREATE EXTENSION IF NOT EXISTS "vector"` ✅

## Notes

- Vector queries use raw SQL (`$queryRawUnsafe`) with parameter binding — Prisma can't select
  `Unsupported` fields natively, so `embedding` never leaks into regular API responses.
- Requires PostgreSQL + pgvector: `CREATE EXTENSION IF NOT EXISTS vector;` (in the migration).
- HNSW index (`vector_cosine_ops`) keeps top-5 lookups fast at scale.
- Students can "Re-match" (sync-me) after editing skills/interests; admins can bulk-sync all users.

## Next Up (Phase 6 — Mobile & Deployment)

React Native + Expo app consuming the same API, plus deployment playbook:
Vercel (web) + Railway/Render (API) + Supabase (Postgres+pgvector), CI/CD, env secrets.
