# HU-121 - Frontend Recovery Evidence

## Purpose

This document records the recovery of the validated billing, invoice copy, and returns frontend views into the official `RematePos-Frontend` repository.

The recovery was performed without touching backend repositories, backend PRs, or existing backend branches.

## Source And Destination

Validated frontend source:

```text
C:\Users\carlo\OneDrive - corhuila.edu.co\CAV\OneDrive - corhuila.edu.co\Descargas\front-rematepos\RematePos-Frontend
```

Official frontend worktree:

```text
C:\Users\carlo\Downloads\microservicios\RematePos-Frontend-HU-121
```

Branch:

```text
feature/HU-121-AFAF-recover-billing-returns-frontend
```

## Recovered Routes

- `/billing`
- `/billing/invoice-copy`
- `/billing/returns`

## Recovered Scope

Recovered from the validated frontend folder:

- invoice copy view behavior;
- recent invoices loading;
- invoice lookup by number;
- returns view behavior;
- return product selection from invoice details.

The existing `/billing` route and router structure were preserved because the official repository already contained those routes.

## API Gateway Integration

The recovered billing service uses:

```text
REACT_APP_API_GATEWAY_URL=http://localhost:8080
```

Gateway endpoints used:

```text
GET /api/v1/invoices/recent?limit=8
GET /api/v1/invoices/number/{invoiceNumber}
GET /api/v1/purchases/invoice/{invoiceNumber}
POST /api/v1/purchases/returns
```

Validated invoice used as reference:

```text
INV-20260513-22
```

## Files Updated

- `src/app/features/billing/pages/InvoiceCopyPage.jsx`
- `src/app/features/billing/pages/ReturnsPage.jsx`
- `src/app/features/billing/services/billingService.js`

## Files Intentionally Not Copied

- real `.env` files;
- `.env.dev`, `.env.qa`, `.env.main`, `.env.release`;
- `node_modules/`;
- `build/`;
- `dist/`;
- `coverage/`;
- logs and `*.log`;
- generated artifacts;
- unrelated frontend views outside the HU-121 scope.

## Validation Plan

Frontend validation:

```text
http://localhost:3000
http://localhost:3000/billing
http://localhost:3000/billing/invoice-copy
http://localhost:3000/billing/returns
```

Backend/API Gateway validation:

```text
http://localhost:8080/api/v1/invoices/recent?limit=8
http://localhost:8080/api/v1/invoices/number/INV-20260513-22
```

## Pending Risks

- The frontend official repository still contains additional local changes in the original non-worktree folder; those were not touched.
- Some broader POS sales views from the validated OneDrive folder remain outside HU-121 and should be recovered through separate user stories.
- The billing checkout route was not fully refactored in this HU to avoid mixing broader sales/POS recovery with invoice copy and returns.
- The PR should remain Draft until the team validates the recovered views against the running backend baseline.

## Security Notes

- No real `.env` file should be committed.
- No generated folders should be committed.
- No secrets, tokens, logs, build outputs, or dependency folders should be committed.
