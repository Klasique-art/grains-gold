# Products Data Contract Request

## Purpose
Frontend products page now supports:
- real-time URL-synced search
- category filter
- availability filter
- sort
- pagination

To connect backend without refactors, please confirm and implement the contract below.

---

## 1) Primary Endpoint (Public Products List)

### Required endpoint
- `GET /api/products/`

### Required query params
- `q` (string): text search over name, maize type, and summary/description
- `category` (string): category slug/id filter
- `availability` (enum): `AVAILABLE | LOW_STOCK | OUT_OF_STOCK`
- `sort` (enum):
  - `featured`
  - `price_asc`
  - `price_desc`
  - `name_asc`
  - `name_desc`
- `page` (number, 1-based)
- `page_size` (number; support at least `4, 6, 12`)

### Example request
`GET /api/products/?q=yellow&category=yellow&availability=AVAILABLE&sort=price_asc&page=2&page_size=6`

---

## 2) Required Response Shape

Please return paginated response:

```json
{
  "count": 124,
  "next": "https://api.example.com/api/products/?page=3&page_size=6&sort=price_asc",
  "previous": "https://api.example.com/api/products/?page=1&page_size=6&sort=price_asc",
  "results": [
    {
      "id": 1,
      "slug": "premium-yellow-maize",
      "name": "Premium Yellow Maize",
      "category": {
        "id": "yellow",
        "name": "Yellow Maize"
      },
      "maize_type": "Yellow Maize",
      "description": "Clean sorted kernels for feed operations.",
      "packaging_size": "50kg bag",
      "price_per_bag": "420.00",
      "price_per_ton": "7950.00",
      "currency": "GHS",
      "availability_status": "AVAILABLE",
      "min_order_quantity": "5 bags",
      "image_url": "https://.../media/products/premium-yellow.jpg",
      "updated_at": "2026-03-15T18:11:09.000000Z"
    }
  ]
}
```

---

## 3) Image Requirement (Important)

Frontend product cards need real images.

Please ensure:
1. `image_url` is included in each product record.
2. URL is absolute and publicly accessible.
3. Null allowed only if image is truly unavailable.
4. Add admin upload support for product image if not already present.

Recommended backend model field:
- `image = models.ImageField(upload_to="products/", null=True, blank=True)`

---

## 4) Category Endpoint (Optional but Recommended)

### Endpoint
- `GET /api/product-categories/`

### Shape
```json
[
  {
    "id": "yellow",
    "name": "Yellow Maize",
    "description": "Best suited for feed mills.",
    "product_count": 42
  }
]
```

This enables dynamic category cards and counts.

---

## 5) Performance + UX Requirements

Please support:
- indexed search and sort fields
- stable pagination order for consistent UX
- low response latency on filter/sort/page changes

Recommended:
- db indexes on `name`, `availability_status`, `category`, `price_per_ton`

---

## 6) Error Contract

Please keep a consistent error format:

```json
{
  "detail": "Invalid availability value."
}
```

For query validation:

```json
{
  "errors": {
    "page_size": ["Must be between 1 and 100"]
  }
}
```

---

## 7) Backend Decisions Needed

Please confirm:
1. Exact enum values for `availability_status`
2. Whether prices are string decimals or numbers
3. Maximum `page_size`
4. Final `sort` param names backend will support
5. Final search fields included in `q`

---

## 8) Frontend Behavior Already Live

Current UI updates URL in real time using:
- `?q=`
- `?category=`
- `?availability=`
- `?sort=`
- `?page=`
- `?page_size=`

Please implement backend query handling for these exact keys to keep integration plug-and-play.

