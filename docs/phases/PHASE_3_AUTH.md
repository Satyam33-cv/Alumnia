# Phase 3: Authentication

## Scope

Implement real client-side validation and session UX for login and registration, wired to the typed API client from Phase 2.

## Completed

- Added local session persistence for the returned token and user session.
- Converted login and registration controls into submitted forms.
- Added required-field, email, password, and password-confirmation validation.
- Added disabled/loading states and accessible form-level errors.
- Preserved the editorial web shell while borrowing the Stitch references' clear form hierarchy and generous spacing.

## Verification

- Typecheck the changed auth files with the repository compiler.
- Manually verify invalid submissions do not call the API and valid submissions show a pending state.
- With an API configured, verify successful auth stores the session and navigates to `/dashboard`.

## Remaining risk

The repository does not include a backend, so successful network authentication requires `NEXT_PUBLIC_API_URL` to point at the deployed API or a local service implementing `/auth/login` and `/auth/register`.
