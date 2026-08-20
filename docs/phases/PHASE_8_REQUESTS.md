# Phase 8: Requests

## Completed

- Added API-backed referral request listing.
- Mapped request statuses into the shared referral thread state machine.
- Added accept and decline mutations with pending, success, and failure feedback.
- Added loading, empty, and retryable error states.

## Verification

No errors found in the requests board and status mutation slice.

## Remaining risk

The configured API must implement `/requests` and `PATCH /requests/:id`.