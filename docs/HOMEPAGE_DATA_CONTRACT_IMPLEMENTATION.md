# Homepage Data Contract Implementation Tracker

Last updated: 2026-03-15  
Owner: Frontend + Backend  
Status: In progress

## Purpose
This document is the implementation companion to [HOMEPAGE_DATA_CONTRACT.md](./HOMEPAGE_DATA_CONTRACT.md).

It tracks:
- what homepage frontend already depends on
- what backend must implement or confirm
- integration checks before replacing mock homepage data with live API

---

## 1) Frontend Contract (Already Live)

Homepage currently renders these backend-relevant data blocks:
- Navbar auth-aware user state
- Hero metrics (stats)
- Products preview cards
- Announcements preview
- Testimonials
- Benefits/how-it-works content
- Footer contact info

Frontend references:
- `app/(root)/page.tsx`
- `components/home/*`
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`

---

## 2) Backend Endpoint Checklist

### 2.1 Navbar auth state
- [ ] Endpoint exists: `GET /api/auth/me/` (or confirmed equivalent)
- [ ] Unauthenticated behavior confirmed (`401` or `200 null`)
- [ ] Returns minimum fields used by navbar/profile UI

### 2.2 Hero metrics
- [ ] Endpoint exists: `GET /api/home/hero-metrics/`
- [ ] Returns partner farmer count, delivery window, repeat customer rate

### 2.3 Products preview (homepage)
- [ ] Endpoint exists: `GET /api/home/products-preview/`
- [ ] Supports `featured` and `limit`
- [ ] Returns product preview payload with pricing + availability

### 2.4 Announcements preview
- [ ] Endpoint exists: `GET /api/home/announcements-preview/`
- [ ] Supports `published` and `limit`
- [ ] Returns latest-first items

### 2.5 Testimonials
- [ ] Endpoint exists: `GET /api/home/testimonials/`
- [ ] Supports featured/published filtering

### 2.6 Benefits/how-it-works
- [ ] Endpoint exists: `GET /api/home/benefits/` (or confirmed content endpoint)
- [ ] Returns ordered content blocks and items

### 2.7 Footer contact
- [ ] Endpoint exists: `GET /api/home/footer-contact/`
- [ ] Returns phone, WhatsApp, email, location text, map URL

---

## 3) Minimum Payload Requirements

### 3.1 Auth user payload (homepage navbar)
```json
{
  "id": "number|string",
  "username": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "user_type": "ADMIN|STAFF|CUSTOMER",
  "profile_picture": "string|null",
  "is_verified": "boolean",
  "is_active": "boolean"
}
```

### 3.2 Product preview payload
```json
{
  "id": "number|string",
  "slug": "string",
  "name": "string",
  "description": "string",
  "maize_type": "string",
  "packaging_size": "string",
  "price_per_bag": "number|string",
  "price_per_ton": "number|string",
  "currency": "string",
  "availability_status": "AVAILABLE|LOW_STOCK|OUT_OF_STOCK",
  "image": "string|null",
  "updated_at": "datetime"
}
```

### 3.3 Announcement preview payload
```json
{
  "id": "number|string",
  "slug": "string",
  "title": "string",
  "excerpt": "string",
  "cover_image": "string|null",
  "published_at": "datetime",
  "is_published": "boolean"
}
```

---

## 4) Backend Decisions To Lock

- [ ] Confirm auth strategy used by frontend calls (JWT/cookie)
- [ ] Confirm enum values for product availability
- [ ] Confirm decimal format for product prices
- [ ] Confirm whether testimonials/benefits are CMS-managed or fixed API content
- [ ] Confirm whether footer contact values are API-managed vs env-configured

---

## 5) Error + Pagination Contract

- [ ] Error format confirmed for homepage endpoints
- [ ] List pagination format confirmed where relevant
- [ ] Preview endpoints confirm whether they return arrays directly or paginated wrappers

Preferred error examples:

```json
{ "detail": "Authentication credentials were not provided." }
```

```json
{ "field_name": ["Validation error"] }
```

---

## 6) Integration Test Scenarios

Run before switching homepage from static mocks to live API:

1. Navbar loads `GET /api/auth/me/` correctly for logged-in and logged-out states.
2. Hero stats endpoint values render without transform hacks.
3. Products preview endpoint returns exactly 3 items when `limit=3`.
4. Announcements preview endpoint returns latest published items first.
5. Testimonials endpoint returns published/featured items only.
6. Benefits/how-it-works endpoint renders all items in backend-defined order.
7. Footer contact endpoint values match links (`tel`, `mailto`, WhatsApp, map).
8. Missing optional images gracefully fallback in UI.

---

## 7) Go-Live Criteria

Switch homepage to live backend data only when:
- [ ] All homepage endpoints are available in target environment
- [ ] Payload shapes match frontend contract exactly
- [ ] Error handling and fallback behavior verified
- [ ] Integration test scenarios pass
- [ ] Team confirms no unresolved contract ambiguities

