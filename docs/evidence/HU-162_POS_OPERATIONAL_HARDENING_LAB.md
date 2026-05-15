# HU-162 - POS operational hardening lab

## Lab scope

- Branch: `feature/HU-162-CAVY-pos-operational-hardening-lab`
- Source branch: `feature/HU-161-CAVY-pos-category-operational-lab`
- Develop baseline already included in the lab: `41b1cd0 feat(HU-151): add category management UI`
- Validation date: 2026-05-15 06:59:06 -05:00

This is a laboratory branch. It must not be merged directly into `develop` and no PR is created from this branch.

## Problems reviewed

1. The POS sale result did not show sold products with a clear receipt structure.
2. Invoice copy showed product details in a cramped layout.
3. Returns UI did not communicate refund or exchange flows realistically.
4. Original invoice totals remained unchanged after a return. This is acceptable for immutable invoices, but the UI needs return status context.
5. `POST /api/v1/purchases/returns` can return `400` with `Return quantity cannot be greater than available purchased quantity: 0`.
6. Categories could be duplicated by name variants in the UI.
7. Category delete should not be presented as a normal action while backend soft-disable is missing.
8. Account settings looked functional even though real auth/JWT/user management is pending.
9. Payment methods needed clear labels for internal cash, sandbox and manual flows.
10. Idempotency is not confirmed and remains a critical backend requirement.

## Backend/API diagnosis

Read-only API checks were executed against `http://localhost:8080`.

| Endpoint | Result | Notes |
| --- | --- | --- |
| `GET /api/v1/products` | 200 | Products returned with category data. |
| `GET /api/v1/customers` | 200 | Customer list returned. |
| `GET /api/v1/customers/document?type=CC&number=1077721349` | 200 | Existing customer returned. |
| `GET /api/v1/customers/document?type=CC&number=222222222222` | 200 | Final consumer customer returned. |
| `GET /api/v1/categories` | 200 | Duplicate names exist in current data, e.g. `agua`. |
| `GET /api/v1/categories/options` | 200 | Category options returned. |
| `GET /api/v1/invoices/recent?limit=8` | 200 | Recent invoices returned. |
| `GET /api/v1/invoices/number/INV-20260515-26` | 200 | Invoice items returned; no structured return summary. |
| `GET /api/v1/invoices/number/INV-20260515-27` | 200 | Invoice items returned; no structured return summary. |
| `GET /api/v1/purchases/26` | 200 | Purchase notes include a return note. |
| `GET /api/v1/purchases/27` | 200 | Purchase/payment data returned. |
| `GET /api/v1/purchases/invoice/INV-20260515-26` | 200 | Purchase returned by invoice. |
| `GET /api/v1/purchases/invoice/INV-20260515-27` | 200 | Purchase returned by invoice. |

Backend source was inspected in read-only mode. `PurchaseReturnRequest` currently supports only:

- `invoiceNumber`
- `productId`
- `quantity`
- `reason`

`PurchaseReturnResponse` returns purchased and returned quantities, but invoice copy responses do not expose a structured return summary. The backend does not currently support `refundMethod`, `returnType`, `replacementProductId`, cash movement, exchange flow or a dedicated `returnId` in the frontend response.

## Changes applied in the lab

### POS sale result

- Added `SaleReceipt` component.
- The sale result now shows:
  - purchase id;
  - invoice number;
  - customer;
  - payment method;
  - payment status;
  - payment reference when present;
  - cash received and change when present;
  - subtotal, tax and total;
  - sold products with quantity, unit price and line subtotal.
- Added explicit payment labels:
  - `CASH`: internal cashier confirmation.
  - `CARD_MANUAL`: manual/dataphone record.
  - `NEQUI`: sandbox.
  - `PSE`: sandbox.

### Invoice copy

- Replaced the cramped product list with a column layout:
  - product;
  - code;
  - quantity;
  - unit price;
  - subtotal.
- Added a return status note explaining that original invoices are historical and the current invoice API does not expose structured return state.

### Returns UI

- Added return type selection:
  - cash refund;
  - product exchange.
- Cash refund is shown as an inventory return plus pending cash-register impact.
- Product exchange is shown as pending because backend support is still required.
- Added estimated refund amount from known invoice item data.
- Blocks repeated return attempts in the UI when backend reports available purchased quantity `0`.
- Keeps payload aligned with the current backend contract and does not invent unsupported fields.

### Categories

- Added frontend normalization for category names:
  - trim;
  - remove accents for comparison;
  - collapse spaces;
  - lowercase.
- Blocks duplicate category names in `/categories`.
- Blocks duplicate quick category names in `/inventory/new`.
- Added a UI note explaining that direct deletion is not exposed and backend soft-disable is pending.

### Account

- The account settings page no longer presents fake working account/password updates.
- Inputs are disabled and a clear notice explains that real authentication, JWT and secure user management are future work.

## Files modified

- `src/app/features/account/pages/AccountSettingsPage.css`
- `src/app/features/account/pages/AccountSettingsPage.js`
- `src/app/features/billing/pages/InvoiceCopyPage.jsx`
- `src/app/features/billing/pages/ReturnsPage.jsx`
- `src/app/features/categories/pages/CategoriesPage.css`
- `src/app/features/categories/pages/CategoriesPage.js`
- `src/app/features/products/pages/NewProductPage.js`
- `src/app/features/sales/components/CheckoutPanel.js`
- `src/app/features/sales/pages/SalesPage.css`

## Files created

- `src/app/features/sales/components/SaleReceipt.js`
- `docs/evidence/HU-162_POS_OPERATIONAL_HARDENING_LAB.md`

## Validation

### Build

- `npm run build`: compiled successfully.

### Browser routes

Validated on `http://localhost:3002`:

| Route | Result |
| --- | --- |
| `/sales` | POS full view loads; payment labels and sandbox/manual hints visible; no `Failed to fetch`. |
| `/billing/invoice-copy` | Invoice `INV-20260515-26` loads; product columns visible; return status note visible; no `Failed to fetch`. |
| `/billing/returns` | Return types and estimated refund visible; no `Failed to fetch`. |
| `/categories` | Duplicate category name is blocked by frontend; delete/disable warning visible. |
| `/inventory/new` | Category selector works; quick category modal opens; duplicate quick category is blocked by frontend; no `Failed to fetch`. |
| `/inventory` | Inventory route loads; no `Failed to fetch`. |
| `/account` | Placeholder warning visible; fake success messages absent. |
| `/billing` | Billing route loads; no `Failed to fetch`. |

Browser console was checked and no new error logs were observed during validation.

## Operational findings

### Idempotency

No strong `idempotencyKey` was confirmed in this frontend lab. This remains a critical backend requirement.

Recommended backend work:

- Generate or require an idempotency key per sale/payment attempt.
- Enforce uniqueness for payment references.
- Make payment confirmation and webhooks idempotent.
- Protect double click and retry scenarios server-side.

### Stock

The frontend does not decrement stock directly. The validated HU-161 flow showed stock changed after backend payment approval. Backend must remain the source of truth.

### Payments

The UI now distinguishes:

- Cash: cashier/internal confirmation.
- Card: manual/dataphone style record.
- Nequi/PSE: sandbox/local simulation unless a real provider is integrated.

No production payment integration is claimed.

### Returns

The current backend return contract supports inventory returns only. Cash refund, exchange, return id, cash-register movement and credit note flows require backend HUs.

The original invoice should remain immutable. A separate return record and net balance summary should be exposed by backend for UI display.

### Cash register

Not implemented in this lab. Required future scope:

- opening cash session;
- initial cash base;
- cash movements;
- totals by payment method;
- expected cash;
- closing cash session;
- differences.

### DIAN

Not implemented in this lab. Future design should keep a configurable provider abstraction:

- `ElectronicBillingProvider`
- `MockDianProvider`
- `AlanubeSandboxProvider`
- `FutureProvider`

No Alanube production coupling is introduced.

## Recommended clean HUs

1. `HU-156 - Recover full POS sales experience`
   - Separate the POS UI recovery from HU-161.
2. `HU-157 - Improve POS sale receipt and invoice copy UI`
   - Separate `SaleReceipt` and invoice copy formatting.
3. `HU-158 - Harden returns UI for current backend contract`
   - Separate return type UI, blocked available quantity handling and backend gap documentation.
4. `HU-159 - Prevent duplicate category names in frontend`
   - Separate frontend duplicate prevention.
5. `HU-163 - Add backend category name normalization and 409 Conflict`
   - Backend source-of-truth duplicate protection.
6. `HU-164 - Replace category delete with backend soft disable`
   - Backend plus frontend category lifecycle.
7. `HU-165 - Document payment idempotency and stock confirmation rules`
   - Architecture and backend implementation plan.
8. `HU-166 - Implement cash register opening and closing`
   - Cash register backend/frontend flow.
9. `HU-167 - Implement robust return records and cash refund/exchange flows`
   - Return records, stock and cash movement.

## Security and repository hygiene

- No backend code was modified.
- No database code was modified.
- No `.env` or `.env.*` files were committed.
- No secrets, tokens or credentials were added.
- No `node_modules`, `build`, `dist`, `coverage`, logs, dumps or backups are intended for commit.
- This branch is lab-only and must not be merged directly into `develop`.
