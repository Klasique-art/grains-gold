# Products Data Contract Response

Date: 2026-03-15  
Status: Accepted

## Response Summary
We confirm the product contract is accepted for integration and aligned with frontend behavior.

The following are approved:
- endpoint scope
- query parameter contract
- response payload shape
- pagination format
- sorting/filtering/search semantics
- error handling expectations
- product image requirement

---

## 1) Endpoints Confirmed

1. Products list:
- `GET /api/products/`

2. Product categories:
- `GET /api/product-categories/`

---

## 2) Query Contract Confirmed (`GET /api/products/`)

- `q` (search): `name`, `maize_type`, `description`, `category.name`
- `category`: category slug or category name
- `availability`: `AVAILABLE | LOW_STOCK | OUT_OF_STOCK`
- `sort`: `featured | price_asc | price_desc | name_asc | name_desc`
- `page`: 1-based page number
- `page_size`: `1..100` (frontend-supported values include `4`, `6`, `12`)

---

## 3) Response Contract Confirmed

Pagination shape:
- `count`
- `next`
- `previous`
- `results`

Per-product fields confirmed:
- `id`
- `slug`
- `name`
- `category` (`id`, `name`) or `null`
- `maize_type`
- `description`
- `packaging_size`
- `price_per_bag`
- `price_per_ton`
- `currency`
- `availability_status`
- `min_order_quantity`
- `image_url`
- `updated_at`

Field notes:
- prices are returned as decimal strings
- `image_url` is absolute when present, `null` when absent

---

## 4) Product Image Requirement

Confirmed and accepted:
- backend will support product image upload and return `image_url` for product cards
- frontend fallback behavior remains in place for `null` images

---

## 5) Error Contract Confirmed

Supported error formats:

```json
{
  "detail": "Invalid availability value."
}
```

```json
{
  "errors": {
    "page_size": ["Must be between 1 and 100"]
  }
}
```

---

## 6) Integration Readiness

No additional contract changes are required at this time.

Next action:
- proceed with wiring frontend service layer to `/api/products/` and `/api/product-categories/` using the confirmed contract.
