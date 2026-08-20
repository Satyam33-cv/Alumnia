# Phase 4: Dashboard

## Scope

Replace the static dashboard surface with typed current-user, alumni, jobs, and request data while retaining the established editorial layout.

## UI direction

Use the Stitch Home Feed's order of attention: welcome context, people spotlight, opportunity activity, and an active thread. Keep the desktop sidebar and use responsive grids rather than adding a mobile-only bottom navigation.

## Acceptance

- The greeting comes from the authenticated user.
- Loading, empty, and error states are explicit and keyboard accessible.
- Detail links use stable IDs.
- The dashboard remains readable when any individual collection is empty.

## Completed

- Added typed dashboard fetching through `useApi` and `apiClient`.
- Added loading skeletons, retryable error state, and per-collection empty states.
- Personalized the greeting from `/users/me` and replaced hard-coded job/thread values.

## Verification

No errors found in the dashboard or auth slices after implementation.

## Remaining risk

The repository still depends on an external API service for populated states; configure `NEXT_PUBLIC_API_URL` before manual data verification.