# Alumnia — 6-Slide Presentation Content

**Alumni Engagement & Career Referral Platform** · AI-powered matching · Web + Mobile
Companion visual deck: `docs/Alumnia-Presentation.html` (open in a browser to view/screenshot/print slides).

---

## SLIDE 1 — Title, Problem & Idea at a Glance

**Title:** Alumnia — Connecting Alumni with Students for Careers & Mentorship

**The Problem (why this matters)**
- College alumni networks are **under-used** — most students don't know which alumni work where.
- Referral requests are **manual and scattered** (WhatsApp groups, emails, spreadsheets) with **no status tracking**.
- Students have **no personalization** — every student sees the same directory, not the most relevant alumni for their skills.
- Admins run everything **by hand** — verifying alumni, approving stories, importing batches, writing reports.
- **No single source of truth** — jobs, stories, events and announcements live in different places, and there is no mobile access.

**Idea at a Glance**
- A **centralized platform** where students discover jobs and alumni, request career referrals (with resume + note), track them Pending → Accepted → Referred → Hired, and get an **AI-personalized "Top 5 Alumni for You"** list.
- Alumni post jobs, share success stories, and respond to referrals from one dashboard — on **web and mobile**.
- Admins get analytics, one-click verification, CSV batch import and a story review queue.

**Journey:** built incrementally in **6 phases** — (1) Core Engine → (2) Engagement → (3) Admin Suite → (4) Comms & Files → (5) AI Smart Matching → (6) Mobile & Deployment.

---

## SLIDE 2 — Proposed Solution

**Detailed explanation of the solution**
- **One REST API + three clients.** A single Express + Prisma API (JWT-secured) powers the Next.js web app, the Expo/React Native mobile app, and any future client.
- **End-to-end referral engine.** Students request referrals on jobs with resume upload + a note; alumni accept/reject, mark referred/hired; every transition generates in-app notifications and optional email/WhatsApp alerts.
- **Full engagement suite.** Job board, alumni directory (filter by batch/dept/company/location), success-story Spotlight Wall with admin approval, events + RSVP with capacity limits, and faculty announcements.
- **Admin command center.** Analytics dashboard (KPIs, users by role, referrals by status, recent activity), alumni verification, CSV bulk import, story review.
- **AI Smart Matching.** Every user profile gets a 384-dim embedding (OpenAI `text-embedding-3-small`, deterministic local fallback). pgvector + HNSW cosine search returns the "Top 5 Alumni for You" ranked by match %, personalized to each student's skills & interests.
- **Comms & files.** SendGrid email + Twilio WhatsApp (both degrade to console placeholder mode without keys), Cloudinary resume storage (local fallback).

**How it addresses the problem**
| Problem | Solution |
|---|---|
| Alumni network unused | Searchable directory + AI "Top 5" personalization + mentor-style matching |
| Scattered, untracked referrals | Structured workflow Pending → Accepted → Referred → Hired with notifications |
| No personalization | pgvector embeddings match alumni to each student's skills/interests |
| Manual admin work | Analytics, CSV import, verification, story review queue |
| No mobile access | Full-featured React Native (Expo) app on Android/iOS |

**Innovation & uniqueness**
- **Hybrid AI matching** — OpenAI embeddings with an offline deterministic fallback, so matching works even with zero API cost/key.
- **Graceful degradation everywhere** — email, WhatsApp, Cloudinary, OpenAI all optional; the platform never breaks without them.
- **One backend, three surfaces** — web + mobile share 100% of business logic; mobile reads the same JWT.
- **Portable auth** — self-owned JWT auth (not platform lock-in) keeps the app deployable anywhere.

---

## SLIDE 3 — Technical Approach

**Technologies**
| Layer | Technology |
|---|---|
| Web client | Next.js 14, React 18, Tailwind CSS, Lucide icons, axios |
| Mobile client | React Native (Expo SDK 52), AsyncStorage, @expo/vector-icons |
| Backend API | Node.js, Express, Prisma ORM, JWT (jsonwebtoken), bcrypt |
| Database | PostgreSQL + **pgvector** extension (HNSW index), Prisma migrations |
| AI | OpenAI `text-embedding-3-small` (384-dim) + local hashing fallback |
| Comms | SendGrid (email), Twilio (WhatsApp) |
| Files | Cloudinary + multer (local fallback), CSV import via csv-parse |
| Infra | Supabase (managed Postgres), Railway/Render (API), Vercel (web), EAS Build (mobile) |

**Architecture / flow**
```
Mobile (Expo) ──┐                       ┌──> PostgreSQL + pgvector
Web (Next.js) ──┼── HTTPS + JWT ──> Express REST API ── Prisma ──┘
                │                    (auth·jobs·referrals·stories·   ──> SendGrid / Twilio
Other clients ──┘                     events·admin·uploads·matching)  ──> Cloudinary / OpenAI
```
Referral workflow: Student → request (resume+note) → Alumni → accept/reject → referred → hired → notifications at each step.

**Methodology & process**
- **Incremental 6-phase delivery**, each phase independently verifiable:
  1. Core engine (auth, roles, users, JWT) → 2. Engagement (jobs, referrals, stories, events, announcements, notifications) → 3. Admin suite (analytics, verification, CSV import) → 4. Comms & files (email/WhatsApp/upload) → 5. AI matching (pgvector) → 6. Mobile & deployment.
- **Verify-as-you-build:** `node --check` on every API file, `next build` for the web app, Babel compile + `npx expo export` (Metro bundle) for mobile, and auth-guard smoke tests (401 without token).
- **Working prototype:** 3 seeded demo accounts, each phase documented in `docs/PHASE*-CHANGES.md`, with a visual test guide PDF.

---

## SLIDE 4 — Feasibility & Viability

**Feasibility analysis**
- **Technical:** All components are mature, free-tier, and well-documented. The platform runs on a single Node server + one Postgres database (free Supabase/Neon tier is enough to start).
- **Economic:** Near-zero marginal cost — external services are optional and degrade gracefully; a college can self-host the entire stack.
- **Operational:** One-command migrations (`prisma migrate deploy`) + seed script; deployment playbook in `docs/DEPLOYMENT.md`.
- **Time:** Built and verified end-to-end across all 6 phases with per-phase deliverables.

**Challenges & risks + strategies**
| Challenge / Risk | Strategy to overcome |
|---|---|
| No live database during development | Graceful fallbacks; migrations + seed verified for one-command DB bring-up |
| External API keys missing | Placeholder mode (console logs / local files / local embeddings) keeps everything testable |
| Cold-start matching | Admin "Sync embeddings" endpoint; local fallback works without OpenAI |
| Local uploads wiped on redeploy | Cloudinary required in production (documented + env-validated) |
| Mobile reachability | `API_URL` env resolution (emulator `10.0.2.2`, LAN IP, production HTTPS) |
| Wrong/lost alumni data | CSV import with temp password + verification workflow |

---

## SLIDE 5 — Impact & Benefits

**Impact on the target audience**
- **Students:** discover relevant alumni, get referred faster, receive notifications at every stage, access the platform from their phone.
- **Alumni:** effortless way to give back — post jobs, share stories, mentor — with minimal effort and positive visibility.
- **Faculty & admins:** automate verification, approval and analytics; data-driven insights into engagement.
- **Institutions:** a modern, branded engagement tool that strengthens placement outcomes and alumni relations.

**Benefits**
- **Social:** closes the student–alumni gap; builds mentoring & community; makes career help equitable (AI personalization surfaces relevant alumni to every student, not just the well-connected).
- **Economic:** better placements and referral-driven hiring (referral hires are faster and cheaper than cold recruiting); low-cost, self-hostable.
- **Environmental:** paperless end-to-end (resumes digital, announcements digital) — CSV import replaces paper registries.
- **Measurable KPIs:** referrals by status, jobs posted, stories approved, events + RSVP counts, match % quality — all visible in the admin analytics dashboard.

---

## SLIDE 6 — Research & References

**Research basis**
- **Referral hiring research** — referred candidates are hired faster and perform better; formalizing referrals improves outcomes (SHRM / NBER referral-hiring studies).
- **Semantic matching** — OpenAI embeddings for skills/interests similarity, ranked with cosine distance over a pgvector HNSW index (vector search best practices, Faiss/ANNOY literature).
- **Secure APIs** — JWT (RFC 7519), bcrypt password hashing, OWASP Top 10 as the baseline for auth/upload/CSV security.
- **Omnichannel engagement** — email (SendGrid) + WhatsApp (Twilio) notifications to reach alumni where they are.

**All resources & solutions used**
| Resource | What it's used for |
|---|---|
| Next.js 14 (nextjs.org/docs) | Web frontend |
| React 18 / Tailwind CSS / Lucide | UI components & styling |
| Expo SDK 52 + EAS Build (docs.expo.dev) | Mobile app + store builds |
| Node.js + Express (expressjs.com) | REST API |
| Prisma ORM (prisma.io/docs) | Schema, migrations, client |
| PostgreSQL + pgvector (github.com/pgvector/pgvector) | Database + vector search (HNSW) |
| OpenAI text-embedding-3-small (platform.openai.com) | Profile embeddings |
| JSON Web Tokens — RFC 7519 (datatracker.ietf.org) | Stateless auth |
| bcrypt (github.com/kelektiv/node.bcrypt.js) | Password hashing |
| SendGrid (sendgrid.com/docs) | Transactional email |
| Twilio WhatsApp (twilio.com/docs) | WhatsApp alerts |
| Cloudinary (cloudinary.com/documentation) | Resume storage |
| multer / csv-parse (npm) | Uploads + CSV import |
| Supabase (supabase.com/docs) | Managed Postgres |
| Railway / Render / Vercel | API + web hosting |
| OWASP Top 10 (owasp.org) | Security baseline |

*All documentation links are the official vendor docs used while building this project.*
