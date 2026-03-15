# Homepage Data Contract Request

## Scope
This request is only for data currently used on the **homepage flow**:
- Navbar (auth-aware state on homepage)
- Hero section
- Benefits/highlights
- Product & price preview
- Testimonials
- Announcements/blog preview
- Footer contact info

We will request dashboard/other pages later.

---

## 1) Homepage User State (Navbar)

Please confirm the response for homepage auth state check.

### Endpoint
- `GET /auth/me` (or equivalent)

### Expected shape
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

Please confirm:
- whether unauthenticated returns `401` or `200` with `null`
- token/cookie auth strategy for frontend requests

---

## 2) Homepage Products Preview (Public)

We need exact product structure for public homepage cards.

### Endpoint
- `GET /products?featured=true` or `GET /products?limit=3` (please confirm actual)

### Expected shape
```json
{
  "id": "number|string",
  "slug": "string",
  "name": "string",
  "description": "string",
  "maize_type": "string|enum",
  "packaging_size": "string",
  "price_per_bag": "number|string",
  "price_per_ton": "number|string",
  "currency": "string",
  "availability_status": "AVAILABLE|LOW_STOCK|OUT_OF_STOCK",
  "image": "string|null",
  "updated_at": "datetime"
}
```

Please confirm:
- exact enum values for availability
- if prices are numeric or string-decimal
- if product images are absolute URLs or media-relative paths

---

## 3) Homepage Announcements / Blog Preview

### Endpoint
- `GET /announcements?published=true&limit=3` (please confirm actual)

### Expected shape
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

Please confirm:
- sort order (latest first?)
- whether `excerpt` is provided by backend or must be derived from `content`

---

## 4) Homepage Testimonials

Please confirm source of testimonials:
- API-based OR static/admin-managed?

If API-based, please provide:
- endpoint
- response schema:
```json
{
  "id": "number|string",
  "customer_name": "string",
  "role_or_business": "string",
  "quote": "string",
  "is_featured": "boolean",
  "created_at": "datetime"
}
```

If static/admin CMS-based, please share:
- where frontend should fetch from
- expected fields and publish controls

---

## 5) Homepage Hero Metrics / Highlights

Current homepage has quick stats (e.g., partner farmers, delivery speed, repeat customer %).

Please confirm:
- are these from API or static?

If API-based, provide endpoint + shape:
```json
{
  "partner_farmers_count": "number",
  "avg_delivery_window": "string",
  "repeat_customer_rate": "number|string",
  "last_updated": "datetime"
}
```

---

## 6) Homepage Benefits / How-It-Works Content

Please confirm if these are:
- static frontend copy for now, OR
- backend-managed content blocks.

If backend-managed, please provide endpoint + schema for:
- section title
- section description
- ordered list of items (title + description + display order)

---

## 7) Footer Contact Info (Shown on Homepage)

Please confirm whether footer contact data is backend-driven.

If yes, provide endpoint + shape:
```json
{
  "phone": "string",
  "whatsapp": "string",
  "email": "string",
  "office_location_text": "string",
  "office_map_url": "string"
}
```

---

## 8) Common API Response Format

Please confirm the standard response envelope used by these endpoints.

Example:
```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

Also share error format for validation and server errors.

---

## 9) Pagination Format (for Products/Announcements)

Please provide exact pagination schema used by list endpoints.

Examples:
- `count, next, previous, results`
- OR `items, page, page_size, total_pages, total_items`

---

## 10) What We Need From Backend Now

Please send:
1. Exact endpoint list for homepage data.
2. Sample JSON payload for each endpoint.
3. Enum/value list for each status field.
4. Auth behavior for public homepage requests vs authenticated navbar state.

This will let frontend mock data **exactly** to backend shape so integration later is plug-and-play.

