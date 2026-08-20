# Phase 6: Jobs

## Completed

- Added searchable typed job results.
- Replaced copy-paste `/jobs/associate-product-manager` links with `/jobs/:id`.
- Wired job detail loading and errors to the typed client.
- Added a validated introduction request note and API submission state.

## Design decision

The supplied Job Board reference supports search-first scanning, concise metadata, and visible referral context. The implementation keeps that hierarchy but uses the existing responsive web shell rather than a mobile bottom bar.

## Verification

No errors found in the jobs list, detail, and request form slice.

## Remaining risk

Populated behavior requires `/jobs`, `/jobs/:id`, and `/requests` on the configured API service.