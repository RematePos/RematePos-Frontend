# HU-135 - Product Category Selector Fix Evidence

## Purpose

Document the frontend fix for product creation with category selection in RematePOS.

This user story is limited to the current product creation flow. It does not implement authentication, roles, cashier permissions, cash register flows, Excel imports, payment integrations or security changes.

## Error Detected

The New Product page at `/inventory/new` did not show a category selector.

When trying to create a product, the frontend sent a payload without category information and the UI displayed:

```text
No se pudo crear el producto.
```

## Root Cause

The backend product API requires `categoryId` in the product creation payload.

Backend contract reviewed:

```text
POST /api/v1/products
```

Expected payload field:

```text
categoryId
```

The frontend page only sent:

```json
{
  "name": "Product name",
  "description": "Product description",
  "price": 10000,
  "stock": 30
}
```

It did not load categories and did not include `categoryId`.

## Files Reviewed

- `src/app/features/products/pages/NewProductPage.js`
- `src/app/features/products/pages/NewProductPage.css`
- `src/app/features/products/services/productService.js`
- `src/app/features/inventory/pages/InventoryPage.js`
- `src/app/features/products/pages/ProductsPage.js`
- `src/app/features/sales/pages/SalesPage.js`
- Backend `ProductRequest` contract, read-only.
- Backend `CategoryController` contract, read-only.

## Files Changed

- `src/app/features/products/pages/NewProductPage.js`
- `src/app/features/products/pages/NewProductPage.css`
- `src/app/features/products/services/productService.js`

## Category Endpoint Used

```text
GET /api/v1/categories/options
```

Validation result:

```json
[
  {
    "id": 1,
    "name": "Alimentos"
  }
]
```

The category was local DEV validation data used to test the flow.

## Product Endpoint Used

```text
POST /api/v1/products
```

## Final Product Creation Payload

```json
{
  "name": "Producto HU135 Test",
  "description": "Producto de validacion categoria",
  "price": 10000,
  "stock": 30,
  "categoryId": 1
}
```

## API Validation

Product creation returned a new product id.

`GET /api/v1/products` returned:

```json
[
  {
    "id": 1,
    "name": "Producto HU135 Test",
    "description": "Producto de validacion categoria",
    "price": 10000.0,
    "stock": 30,
    "imageUrl": null,
    "categoryId": 1,
    "categoryName": "Alimentos",
    "categoryDescription": "Categoria local de validacion HU-135"
  }
]
```

## Visual Validation

Frontend was executed locally on:

```text
http://localhost:3002
```

Validated route:

```text
http://localhost:3002/inventory/new
```

Results:

- Category selector was visible.
- Category options loaded from the API.
- `Alimentos` was visible as a selectable category.
- No `Failed to fetch` message appeared.

## Inventory Validation

Route:

```text
http://localhost:3002/inventory
```

Result:

- `Producto HU135 Test` was visible.
- Stock `30` was available in the product response.

## Sales Validation

Route:

```text
http://localhost:3002/sales
```

Result:

- `Producto HU135 Test` was visible in the sales product list.
- Existing sales route continued loading without `Failed to fetch`.

## Billing Validation

Routes:

```text
http://localhost:3002/billing
http://localhost:3002/billing/invoice-copy
http://localhost:3002/billing/returns
```

Results:

- Billing route rendered.
- Invoice copy route rendered without `Failed to fetch`.
- Invoice `INV-20260513-22` remained visible in invoice copy validation.
- Returns route rendered.

## Scope Control

This PR does not include:

- authentication;
- JWT;
- roles or permissions;
- protected routes;
- cash register opening or closing;
- payment gateway changes;
- Excel import;
- backend changes;
- database schema changes;
- billing logic changes;
- inventory stock policy changes.

## Security And Generated Files

- No real `.env` files were committed.
- No secrets were committed.
- No `node_modules/` was committed.
- No `build/`, `dist/`, `coverage/` or logs were committed.
- `package-lock.json` was not included because no dependency change was required.

## Pending Risks

- The local clean DEV database did not initially contain categories, so a local DEV category was created only to validate the flow.
- Category administration remains outside HU-135.
- Future HUs should define the definitive category seed or category management workflow for clean environments.
