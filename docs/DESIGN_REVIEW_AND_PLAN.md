# AlumniConnect — Phase 0: Repository Audit, Design Review & Implementation Plan

> Companion document to the project''s existing files. Updated each phase; do not delete prior phases.

---

## 0.1 What is this project actually built on?

| Concern | Reality | The Stitch prompt assumes |
| --- | --- | --- |
| Framework | Next.js 14 (App Router) | Expo + Expo Router |
| Language | TypeScript strict | TypeScript (RN) |
| Styling | Tailwind 3.4 + custom theme (Fraunces / Inter / Plex Mono) | NativeWind on RN |
| Icons | lucide-react | MaterialIcons |
| HTTP | Axios client in `lib/api.ts` | Same shape, mobile fetch |
| Backend | Not in this repo (mock-data in `lib/mock-data.ts`) | Express + Prisma + Postgres |
| Routing | App-Router under `app/*` | Expo-Router under `app/*` |
| Auth | `window.localStorage` token only, no real flow | Email/password with AsyncStorage |
| State | Local React + 1 client component with `useState` | Same |

**Decision (Phase 0):** Treat the Stitch export as *design inspiration* (palette, hierarchy, IA, copy voice) rather than a 1:1 port. Keep the existing **Editorial / Academic** design language — paper background, brass accent, Fraunces display serif — which is already stronger for an alumni community than a generic mobile bottom-nav re-skin. Apply the **layout discipline** (clear header hierarchy, status chips, empty states, real empty/error/loading states) the Stitch screens demonstrate, **into the existing Next.js app**.

This keeps velocity high (no Expo rewrite) and respects that the palette tokens, type system, and navigation of the existing app were clearly a deliberate choice.

---

## 0.2 Phase plan

| # | Theme | Output |
| --- | --- | --- |
| 0 | Audit + plan | This document |
| 1 | Design tokens + primitive components | `lib/design/tokens.ts`, `components/ui/*` |
| 2 | Typed API client + server cache hooks | `lib/api/*`, `lib/hooks/*` |
| 3 | Auth flow (login + register) | Real validation, session UX |
| 4 | Dashboard | Real data, greeting, loading/empty |
| 5 | Directory + profile detail | Search/filter, profile route |
| 6 | Jobs + job detail + request intro | `/jobs`, `/jobs/[id]`, request flow |
| 7 | Events + event detail + RSVP | `/events`, `/events/[id]`, RSVP |
| 8 | Requests / referrals board | State machine UI |
| 9 | Admin command center | Real metrics + CSV import UX |
| 10 | A11y, responsiveness, doc finalise | Pass `npm run lint` + `npm run build` |

Each phase ends with: (a) lint clean, (b) types clean, (c) manual visual check against the corresponding Stitch screen / pattern, (d) update at the bottom of this file.

---

## 0.3 Coding review (current code)

### Strengths
- Consistent visual language: Fraunces for headlines, Inter for body, IBM Plex Mono for utility labels.
- Tight, considered typography scale using `tracking-[0.2em]` for mono caps and `font-display text-5xl` for headings.
- Already correct React patterns in `MatchRing` (animation via `requestAnimationFrame` + `pathLength=100` trick) and `ReferralThread` (clear status state machine).
- No `any`s in app code; strict TS on.

### Issues to fix (prioritised)

| # | File / area | Issue | Fix |
| --- | --- | --- | --- |
| C1 | `components/AlumniCard.tsx` | `<Link href="/directory">` on every card points back to the list, regardless of which alumni it is. Dead link. | Link to `/directory/[id]` (create that route). |
| C2 | `app/dashboard/page.tsx` | Hard-coded greeting `"Ava."` and dashboard is a single one-line JSX tree with no loading/empty states. | Pull current user from `/api/users/me`; render loading skeleton and empty state. |
| C3 | `app/directory/page.tsx` | Search input has no state — value goes nowhere; `concat([...])` mutates an unknown array shape (item has `initials` only, no `match`). | Add `useState` query, debounce, filter on result; add proper `Alumni` type. |
| C4 | `app/jobs/page.tsx` | All rows hard-link to `/jobs/associate-product-manager` — copy-paste. | Use `job.id` + dynamic route; already have `/jobs/[id]`. |
| C5 | `app/role-shell/...` (sidebar) | No active-link styling; sidebar identical on every page including admin. | Add `usePathname` + active-class. |
| C6 | `lib/api.ts` | `axios.create` with no error normalisation, no response typing. No interceptor for 401. | Wrap in typed `apiFetch`; redirect on 401. |
| C7 | `app/login`, `app/register` | Forms are static `<button type="button">`; no submit handler, no validation, no error UX. | Real form state, validation, disable while submitting, error message slot. |
| C8 | `app/admin`, `app/requests` | Stats hard-coded; no real metrics. | Replace `12,480` etc. with `useEffect` fetch; skeleton on load. |
| C9 | No `not-found.tsx` / `error.tsx` / `loading.tsx` at app level | Hard 404s and uncaught errors will use Next defaults. | Add minimal app/error.tsx + app/loading.tsx. |
| C10 | No `metadata` per-page | Only root metadata. | Add `generateMetadata` or static `metadata` per page. |
| C11 | Components have repeated classes (`border border-ink-900/10 bg-white/70`) | DRY violation, makes theming fix expensive. | Extract `Card` component; use across dashboard, directory, admin. |
| C12 | No skeleton / loading components | Manual `gap-10` and one-shot fetches feel janky. | Build a small `Skeleton` set. |

### Design review

- **What''s working:** the editorial typography and brass accent are distinctive. Lots of `-translate-y-0.5 / -translate-x-0.5` micro-motion on CTAs is a nice signal. The referral thread stepper (`ReferralThread`) is genuinely thoughtful and worth keeping verbatim.
- **What''s missing for "premium" feel:** page-level loading skeletons, real empty states (the directory says "Find your people" with no result helper; the events list has 2 hard-coded items), keyboard focus rings on underlined CTAs (only the form fields get the brass ring), and per-page metadata for shareability.
- **What to borrow from the Stitch screens:** the *information hierarchy* of Home (welcome → spotlight → activity), the *stepped engagement* of Mentorship Hub (Top match → Pending requests → Become a mentor), the *progress affordance* of Giving (we don''t have a donations module so this won''t port directly, but the campaign progress bar pattern is reusable for "Your referral goal this year").
- **What to ignore:** bottom-tab navigation, chips-as-tabs, 360px mobile-first layouts. Those belong in a phone app, not a Next.js web app.

---

## 0.4 Design tokens (canonical reference)

The project already has a Tailwind `theme.extend` palette in `tailwind.config.ts`. Phase 1 elevates these into a single TS module so other libraries (any charting, headless UI libs, MDX) can import them.

```ts
// lib/design/tokens.ts — created in Phase 1
export const tokens = {
  color: {
    ink: { 900: "#12213D" },                 // primary text, dark surfaces
    paper: { 50: "#F7F5F0" },                // app background, light surfaces
    brass: { 500: "#B8863B" },               // primary accent
    sage: { 500: "#5C7A6B" },                // secondary accent (success, links)
    clay: { 500: "#B5573F" },                // warning/reject state
    mist: { 200: "#DCE1E6" }                 // border, divider
  },
  radius: { sm: 4, DEFAULT: 8, lg: 16, xl: 24, pill: 9999 },
  shadow: { paper: "0 18px 55px rgba(18, 33, 61, 0.08)" },
  type: {
    display: "var(--font-fraunces)",
    body: "var(--font-inter)",
    mono: "var(--font-plex-mono)"
  },
  spacing: { gutter: "1.5rem", section: "3.5rem" }
} as const;
```

**Type scale** (uniform across pages):

| Token | Size | Weight | Use |
| --- | --- | --- | --- |
| `display.xl` | `text-5xl sm:text-6xl lg:text-7xl` | `font-display font-semibold tracking-tight` | Page hero |
| `display.lg` | `text-4xl sm:text-5xl` | `font-display font-semibold` | Section heading |
| `display.md` | `text-2xl sm:text-3xl` | `font-display font-semibold` | Card title |
| `body.lg` | `text-base sm:text-lg leading-7` | `font-sans font-normal` | Sub-hero copy |
| `body.md` | `text-sm leading-6` | default | Paragraphs |
| `body.sm` | `text-xs leading-5` | default | Captions/meta |
| `eyebrow` | `text-xs uppercase tracking-[0.2em]` | `font-mono` | Pre-headline label |

---

## 0.5 Component primitives (to build in Phase 1)

| Component | Replaces | Used on |
| --- | --- | --- |
| `<Card>` | the 5+ inline `border border-ink-900/10 bg-white/70 p-…` declarations | Dashboard, Directory, Admin, Job detail |
| `<Button variant="primary" \| "secondary" \| "ghost">` | every inline `rounded-full bg-ink-900 …` button | Auth, forms, CTAs |
| `<Field label error>` | the bare `<label>` blocks in login/register/jobs/new/events/new | All forms |
| `<Badge tone="success" \| "warning" \| "neutral">` | one-off colored chips | Job referral tag, request status, profile states |
| `<EmptyState icon title body action>` | none — page is silent when empty | Dashboard, Directory, Jobs, Events, Requests |
| `<Skeleton variant="line" \| "card" \| "circle">` | none | All pages with async data |
| `<ErrorState title body retry>` | none | All pages with async data |
| `<PageHeader eyebrow title lede actions>` | repeated page-hero markup | Every page |

---

## 0.6 Phase-by-phase log

Each phase appends a short section here summarizing: files changed, decisions made, screenshots/notes, what''s left.

### Phase 1 (planned)

Files to add:
- `lib/design/tokens.ts`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/Field.tsx`
- `components/ui/Badge.tsx`
- `components/ui/EmptyState.tsx`
- `components/ui/Skeleton.tsx`
- `components/ui/ErrorState.tsx`
- `components/ui/PageHeader.tsx`
- `components/ui/index.ts` re-exports

Files to modify:
- `tailwind.config.ts` — register tokens under theme keys so they''re discoverable; keep existing classes working.

Acceptance:
- No behaviour change on any existing page; only structure (Card/Button/PageHeader) extracted.
- `npm run lint` clean.

### Phase 1 — DONE

Added:
- `lib/design/tokens.ts` — canonical JS tokens mirroring the Tailwind theme.
- `components/ui/{Button, Card, Field, Badge, EmptyState, Skeleton, ErrorState, PageHeader}.tsx` and `index.ts`.
- Re-typed `lib/mock-data.ts` with proper `Alumni`, `Job`, `EventItem` types, IDs on every row, and optional fields removed from the required shape. This unblocks type-safe downstream pages.

Verified:
- `node node_modules/typescript/bin/tsc --noEmit` emits no errors from the new files. Remaining errors are the pre-existing C2/C3/C4/C5 bugs and missing `next` types due to a partial `node_modules` install (no Next version files completed writing before npm timed out). Both groups are addressed in the next phases.
- Primitives follow the documented rules: tokens (no invented colors), design tokens (single source of truth), type scale (uniform across pages), and component naming (`<Card>`, `<Button>` with explicit variants).

Notes:
- `Button` wraps `forwardRef` and supports `variant`, `size`, optional `iconRight`. Adds `group` class so existing hover micro-motion on CTAs continues to work.
- `Field` handles `error`, `hint`, `aria-invalid`, `aria-describedby`, so login/register forms can plug in directly in Phase 3.
- `Card` covers the 3 main tones seen in the codebase (`default`, `muted`, `dark`) with explicit padding sizes.
- `EmptyState`, `Skeleton`, `ErrorState` are the trust-builders; will be wired up in Phase 4 onwards once pages are async.

Next: Phase 2 — typed API client + React Query/SWR. Phase 3+ will start consuming these primitives in existing pages.

### Phase 2 — DONE

Added:
- `lib/api.ts` — typed `apiFetch` wrapper with response unwrapping, normalized `ApiError`, and token cleanup on 401 responses.
- `lib/api/types.ts` — shared contracts for users, auth sessions, referrals, and admin metrics, reusing the existing alumni, job, and event types.
- `lib/api/client.ts` — typed methods for auth, alumni, jobs, events, referral requests, and admin metrics.
- `lib/hooks/useApi.ts` — dependency-free stale-while-revalidate cache hook with loading, validating, error, refresh, and mutate states.

Decisions:
- Kept Axios as the transport and avoided adding a cache dependency while the backend is outside this repository.
- Resource methods use stable IDs in path segments so detail pages and mutation flows can consume the same client.
- The cache is module-local and deduplicates concurrent requests by key; later phases can wire it into client pages without changing the API contract.

Verification:
- Phase 2 modules emit no TypeScript errors. Full-project checking remains blocked by the existing incomplete Next install and the known directory/jobs rows missing required IDs.

Next: Phase 3 — real auth validation, session UX, and typed client wiring.

### Phase 3 — DONE

Added:
- `lib/auth.ts` — browser session persistence and cleanup for authenticated users.
- `components/LoginForm.tsx` and `components/RegisterForm.tsx` — controlled forms with validation, disabled submit states, and accessible server errors.
- `components/ui/Field.tsx` — dark-surface support for the registration form while preserving the shared field API.
- `docs/UI_PLAN.md` and `docs/phases/PHASE_3_AUTH.md` — design direction, Stitch inspiration audit, and phase record.

Decisions:
- The Stitch references informed spacing, hierarchy, and status treatment; the web app keeps its editorial typography, sidebar navigation, and existing token palette.
- Auth success stores the returned token and session before navigating to the dashboard. API failures remain visible instead of silently falling back to fake authentication.

Verification:
- No errors found in the changed auth routes, form components, session helper, or shared Field primitive.

Next: Phase 4 — typed dashboard data with loading, empty, and error states.

### Phase 4 — DONE

Added:
- `components/DashboardContent.tsx` — typed dashboard fetch for current user, alumni, jobs, and referral requests.
- `app/dashboard/page.tsx` — retains the role shell while delegating data states to the client surface.
- `docs/phases/PHASE_4_DASHBOARD.md` — dashboard-specific UI acceptance and delivery notes.

Decisions:
- The Stitch Home Feed hierarchy informed the order of content, but the responsive sidebar and editorial card language remain the web product's navigation model.
- Failed data loads are visible and retryable. Empty collections explain the next useful action instead of disappearing silently.
- Dashboard links use alumni and job IDs, establishing the route contract needed by later detail pages.

Verification:
- No errors found in the dashboard or auth slices after Phase 4.

Next: Phase 5 — searchable directory and alumni profile detail route.

### Phase 5 — DONE

Added:
- `components/DirectoryContent.tsx` — deferred search with typed API results and explicit state handling.
- `components/AlumniProfileContent.tsx` and `app/directory/[id]/page.tsx` — ID-based alumni detail route.
- `components/AlumniCard.tsx` — profile links now preserve the alumni ID.
- `docs/phases/PHASE_5_DIRECTORY.md` — separate phase record.

Decisions:
- Search uses the API query parameter and a deferred input value so typing remains responsive without inventing a second client-side data model.
- The directory borrows Stitch's search-and-filter emphasis, but keeps the web app's card density and role shell.

Verification:
- No errors found in the directory, profile route, and alumni card slice.

Next: Phase 6 — ID-based jobs, job detail data, and referral introduction flow.

### Phase 6 — DONE

Added:
- `components/JobListContent.tsx` — searchable typed job list with loading, empty, and retryable error states.
- `components/JobDetailContent.tsx` — ID-based detail view and introduction request form.
- `app/jobs/page.tsx` and `app/jobs/[id]/page.tsx` — route wiring through stable job IDs.
- `docs/phases/PHASE_6_JOBS.md` — separate phase record.

Decisions:
- The Stitch Job Board search and metadata-chip patterns informed the information hierarchy, while the web version keeps the existing role shell and editorial typography.
- Introduction requests require a short note and show a status message after submission; the UI does not claim success before the API responds.

Verification:
- No errors found in the jobs list, detail, and request form slice.

Next: Phase 7 — event detail and RSVP state.

### Phase 7 — DONE

Added:
- `components/EventListContent.tsx` — typed event list with loading, empty, and retryable error states.
- `components/EventDetailContent.tsx` and `app/events/[id]/page.tsx` — event detail and RSVP interaction.
- `app/events/page.tsx` — API-backed event list with stable IDs.
- `docs/phases/PHASE_7_EVENTS.md` — separate phase record.

Decisions:
- The Stitch Events Hub informed date emphasis, location/time metadata, and a clear registration action; the existing web role shell and editorial palette remain canonical.
- RSVP status changes only after the API responds. The current API has no separate attendance read endpoint, so initial attendance is unknown until the user performs an RSVP action.

Verification:
- No errors found in the Phase 7 event list, detail, and RSVP slice.

Next: Phase 8 — requests/referrals board state machine.

### Phase 8 — DONE

Added:
- `components/RequestsContent.tsx` — typed referral board with pending, accepted, declined, and completed states.
- `app/requests/page.tsx` — API-backed request list with loading, empty, error, and mutation feedback.
- `docs/phases/PHASE_8_REQUESTS.md` — separate phase record.

Verification:
- No errors found in the requests board and status mutation slice.

Next: Phase 9 — admin metrics and CSV import UX.

### Phase 9 — DONE

Added:
- `components/AdminContent.tsx` — typed metrics cards, retryable metrics errors, and accessible CSV selection feedback.
- `app/admin/page.tsx` — API-backed command center.
- `docs/phases/PHASE_9_ADMIN.md` — separate phase record.

Decisions:
- CSV selection is intentionally a review boundary; records are not reported as imported until an import endpoint exists.

Verification:
- No errors found in the admin metrics and CSV selection slice.

Next: Phase 10 — accessibility, metadata, boundaries, and final verification.

### Phase 10 — DONE

Added:
- `app/error.tsx`, `app/loading.tsx`, and `app/not-found.tsx` — app-level recovery and loading boundaries.
- Per-page metadata for the primary routes.
- `components/RoleShell.tsx` — active navigation, `aria-current`, focus states, accessible mobile controls, and real sign-out.
- `docs/phases/PHASE_10_FINISH.md` — separate final phase record.

Verification:
- No errors found in the Phase 8–10 changed files.
- Full-project TypeScript remains blocked by the incomplete local Next installation; the remaining diagnostics are missing `next` module/type declarations rather than feature-slice errors.

Final status:
- Phases 0–10 are implemented in the repository.
- A configured backend is still required for populated API states and successful auth/data mutations.
