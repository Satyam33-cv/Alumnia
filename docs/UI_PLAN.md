# PRO ALUMN UI Plan

## Product direction

PRO ALUMN is a web-based alumni network, not a mobile app port. The product should feel editorial, warm, and useful for repeated professional workflows: finding people, scanning opportunities, and continuing referral conversations.

The existing Fraunces, Inter, and IBM Plex Mono system with paper, ink, brass, sage, and clay tokens remains the visual foundation. It gives the product a recognizable academic character and supports clear status communication without relying on a generic SaaS dashboard palette.

## Inspiration audit

The supplied Stitch screens are valuable references for information hierarchy and interaction density:

- Use the Home Feed structure: welcome context, one clear spotlight, then recent activity.
- Use Directory and Job Board patterns: prominent search, compact filters, metadata chips, and visible referral states.
- Use Mentorship Hub patterns: one primary match, clear pending state, and direct actions.
- Use Events patterns: featured event treatment, date emphasis, RSVP state, and location/time metadata.
- Use Giving only as a progress-pattern reference. Do not add donation or payment behavior until a donations schema and payment provider exist.

Do not copy the mobile-only assumptions into this Next.js app:

- Keep the existing responsive sidebar and desktop information density instead of adding a bottom tab bar.
- Keep lucide-react because it is already installed and consistent across the web app.
- Do not use static stock imagery as a substitute for real profile or event data.
- Do not reproduce the Stitch near-black/bronze palette wholesale; use the established project tokens.

## UI principles

1. Every data-backed surface has loading, empty, error, and success states.
2. Search and filters must change the visible result set and preserve keyboard access.
3. IDs drive detail routes and actions; labels never determine navigation.
4. Primary actions use one clear button hierarchy, with visible focus rings and disabled states.
5. Status is communicated with text and color, never color alone.
6. Repeated surfaces use shared primitives so spacing, borders, and contrast remain consistent.
7. Mobile layouts should compress grids into a readable single column without hiding essential actions.
8. Page metadata, document landmarks, labels, and alert semantics are part of the design, not final polish.

## Phase delivery

- Phase 3: auth validation, session persistence, and error UX.
- Phase 4: dashboard data states and personalized greeting.
- Phase 5: searchable directory and profile details.
- Phase 6: ID-based jobs and referral request flow.
- Phase 7: event details and RSVP state.
- Phase 8: referral board state machine.
- Phase 9: admin metrics and operational empty/error states.
- Phase 10: metadata, app-level boundaries, responsive and accessibility pass.

Each completed phase gets a separate note in `docs/phases/` with changed files, decisions, verification, and remaining risk.
