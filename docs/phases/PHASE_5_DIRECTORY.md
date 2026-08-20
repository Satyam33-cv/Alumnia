# Phase 5: Directory

## Completed

- Added typed directory search using `useApi` and `apiClient.alumni.list`.
- Added loading skeletons, retryable errors, and no-results guidance.
- Fixed alumni cards to link with stable IDs.
- Added `/directory/[id]` profile detail rendering.

## Design decision

The Stitch directory supplied the right interaction pattern: search first, compact metadata, and clear mentorship/profile actions. The implementation keeps the existing editorial web shell and avoids importing the mobile bottom navigation.

## Verification

No errors found in the directory, profile route, and alumni card slice.

## Remaining risk

Populated results require the configured API service to implement `/alumni` and `/alumni/:id`.