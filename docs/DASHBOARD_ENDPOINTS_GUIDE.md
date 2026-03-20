# Dashboard Endpoints Guide

This backend currently does **not** expose a single `/dashboard/` endpoint.
Build the dashboard by composing the endpoints below.

## Base URL
- `http://127.0.0.1:8000/api`

## Auth
- Most dashboard/admin data requires JWT.
- Header:
```http
Authorization: Bearer <access_token>
```

---

## 1) Dashboard Metrics

### 1.1 Farmer Metrics Summary (Admin/Staff)
- Endpoint: `GET /api/farmers/reports/`
- Purpose: Top-level farmer and supply totals for dashboard cards.
- Request payload: none (query params not used)

Example response (`200`):
```json
{
  "total_farmers": 124,
  "approved_farmers": 103,
  "active_farmers": 118,
  "supplies_summary": {
    "total_supplies": 15840,
    "total_cost": "2045000.00",
    "total_paid": "1720000.00"
  }
}
```

### 1.2 Homepage Hero Metrics (Public)
- Endpoint: `GET /api/home/hero-metrics/`
- Purpose: Marketing-style summary metrics (can be reused on customer dashboard).
- Request payload: none

Example response (`200`):
```json
{
  "partner_farmers_count": 500,
  "avg_delivery_window": "24-48 hours",
  "repeat_customer_rate": "82.50",
  "last_updated": "2026-03-20T11:30:14.923182Z"
}
```

### 1.3 Customer Personal Metrics (Customer/Admin context)
- Endpoint: `GET /api/customers/me/`
- Purpose: Per-customer totals (orders + spend), profile widget.
- Request payload: none

Example response (`200`):
```json
{
  "id": 8,
  "user": {
    "id": 21,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "user_type": "CUSTOMER",
    "profile_picture": null,
    "mobile_number": "+233241234567",
    "whatsapp_number": null,
    "is_verified": false,
    "is_active": true,
    "created_at": "2026-03-18T09:31:00.000000Z",
    "updated_at": "2026-03-20T12:10:00.000000Z"
  },
  "customer_id": "CUS0008",
  "location": "Accra",
  "is_active": true,
  "total_orders": 14,
  "total_spent": "19850.00",
  "created_at": "2026-03-18T09:31:00.000000Z",
  "updated_at": "2026-03-20T12:10:00.000000Z"
}
```

---

## 2) Recent Activity

### 2.1 Stock Movement Feed (Admin/Staff)
- Endpoint: `GET /api/inventory/movements/`
- Purpose: Recent inventory activity stream.
- Query payload:
  - `page` (optional)
  - `stock` (optional filter by stock id)
  - `movement_type` (optional: `ADDITION|DEDUCTION|TRANSFER|DAMAGE`)

Example request:
- `GET /api/inventory/movements/?ordering=-created_at&page=1`

Example response (`200`, paginated):
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 91,
      "stock": 12,
      "stock_product_name": "Premium Yellow Maize",
      "movement_type": "DEDUCTION",
      "quantity_bags": 30,
      "quantity_tons": "1.800",
      "order": 57,
      "reason": "Order ORDA1B2C3D4E approved",
      "performed_by": 1,
      "performed_by_name": "Admin User",
      "created_at": "2026-03-20T10:15:21.021411Z"
    }
  ]
}
```

### 2.2 Recent Orders (Admin/Staff/Customer scoped by role)
- Endpoint: `GET /api/orders/`
- Purpose: Latest transactional activity.
- Query payload:
  - `page` (optional)
  - `order_status` (optional)
  - `payment_option` (optional)
  - `delivery_method` (optional)
  - `product` (optional product id)
  - `search` (optional order/customer search)
  - `ordering` (optional: `created_at`, `-created_at`, `total_price`, `-total_price`)

Example request:
- `GET /api/orders/?ordering=-created_at&page=1`

Example response (`200`, paginated):
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 57,
      "order_id": "ORDA1B2C3D4E",
      "customer": 8,
      "customer_details": {
        "id": 8,
        "user": {
          "id": 21,
          "username": "john_doe",
          "email": "john@example.com",
          "first_name": "John",
          "last_name": "Doe",
          "full_name": "John Doe",
          "user_type": "CUSTOMER",
          "profile_picture": null,
          "mobile_number": "+233241234567",
          "whatsapp_number": null,
          "is_verified": false,
          "is_active": true,
          "created_at": "2026-03-18T09:31:00.000000Z",
          "updated_at": "2026-03-20T12:10:00.000000Z"
        },
        "customer_id": "CUS0008",
        "location": "Accra",
        "is_active": true,
        "total_orders": 14,
        "total_spent": "19850.00",
        "created_at": "2026-03-18T09:31:00.000000Z",
        "updated_at": "2026-03-20T12:10:00.000000Z"
      },
      "product": 3,
      "product_details": {
        "id": 3,
        "slug": "premium-yellow-maize",
        "name": "Premium Yellow Maize",
        "category": { "id": "grain", "name": "Grain" },
        "maize_type": "Yellow",
        "description": "Clean and dry maize for food processing",
        "packaging_size": "50kg bag",
        "price_per_bag": "350.00",
        "price_per_ton": "7000.00",
        "currency": "GHS",
        "availability_status": "AVAILABLE",
        "min_order_quantity": 5,
        "image_url": null,
        "updated_at": "2026-03-19T15:09:22.000000Z"
      },
      "quantity_bags": 20,
      "quantity_tons": "1.200",
      "unit_price": "350.00",
      "total_price": "7000.00",
      "delivery_method": "DELIVERY",
      "delivery_address": "Adenta, Accra",
      "delivery_date": "2026-03-22",
      "payment_option": "MOBILE_MONEY",
      "order_status": "PROCESSING",
      "customer_notes": "",
      "admin_notes": "",
      "approved_by": 1,
      "approved_by_name": "Admin User",
      "approved_at": "2026-03-20T10:15:21.001111Z",
      "created_at": "2026-03-20T09:58:00.000000Z",
      "updated_at": "2026-03-20T10:15:21.001111Z"
    }
  ]
}
```

### 2.3 Customer Order History (Customer)
- Endpoint: `GET /api/orders/history/`
- Purpose: "Recent My Activity" list for customer dashboard.
- Request payload: none
- Response is a plain array (not paginated in this action).

Example response (`200`):
```json
[
  {
    "id": 57,
    "order_id": "ORDA1B2C3D4E",
    "customer": 8,
    "customer_details": { "...": "..." },
    "product": 3,
    "product_details": { "...": "..." },
    "quantity_bags": 20,
    "quantity_tons": "1.200",
    "unit_price": "350.00",
    "total_price": "7000.00",
    "delivery_method": "DELIVERY",
    "delivery_address": "Adenta, Accra",
    "delivery_date": "2026-03-22",
    "payment_option": "MOBILE_MONEY",
    "order_status": "PROCESSING",
    "customer_notes": "",
    "admin_notes": "",
    "approved_by": 1,
    "approved_by_name": "Admin User",
    "approved_at": "2026-03-20T10:15:21.001111Z",
    "created_at": "2026-03-20T09:58:00.000000Z",
    "updated_at": "2026-03-20T10:15:21.001111Z"
  }
]
```

---

## 3) Alerts & Operational Widgets

### 3.1 Low Stock + Expiry Alerts (Admin/Staff)
- Endpoint: `GET /api/inventory/stock/alerts/`
- Purpose: Dashboard alert cards/tables.
- Request payload: none

Example response (`200`):
```json
{
  "low_stock": [
    {
      "id": 12,
      "product": 3,
      "product_name": "Premium Yellow Maize",
      "quantity_bags": 42,
      "quantity_tons": "2.100",
      "source_type": "FARMER",
      "farmer": 18,
      "farmer_name": "Kwame Mensah",
      "quality_grade": "Grade A",
      "moisture_content": "13.20",
      "warehouse_location": "Main Warehouse",
      "cost_price": "260.00",
      "date_received": "2026-03-01T08:00:00Z",
      "expiry_alert_date": "2026-03-30",
      "notes": "",
      "is_low_stock": true,
      "created_at": "2026-03-01T08:01:00Z",
      "updated_at": "2026-03-20T10:15:21Z"
    }
  ],
  "expiring_soon": [
    {
      "id": 12,
      "product": 3,
      "product_name": "Premium Yellow Maize",
      "quantity_bags": 42,
      "quantity_tons": "2.100",
      "source_type": "FARMER",
      "farmer": 18,
      "farmer_name": "Kwame Mensah",
      "quality_grade": "Grade A",
      "moisture_content": "13.20",
      "warehouse_location": "Main Warehouse",
      "cost_price": "260.00",
      "date_received": "2026-03-01T08:00:00Z",
      "expiry_alert_date": "2026-03-30",
      "notes": "",
      "is_low_stock": true,
      "created_at": "2026-03-01T08:01:00Z",
      "updated_at": "2026-03-20T10:15:21Z"
    }
  ]
}
```

### 3.2 Stock List (Admin/Staff)
- Endpoint: `GET /api/inventory/stock/`
- Purpose: Inventory table in dashboard.
- Query payload:
  - `page` (optional)
  - `product` (optional)
  - `warehouse_location` (optional)
  - `source_type` (optional: `FARMER|MARKET_PURCHASE`)
  - `search` (optional on product name/location)
  - `ordering` (optional: `date_received`, `-date_received`, `quantity_bags`, `-quantity_bags`)

Response shape: paginated list of `StockSerializer` items (same item structure as alerts above).

---

## 4) Support Endpoints for Dashboard Sections

### 4.1 Recent Farmers (Admin/Staff)
- Endpoint: `GET /api/farmers/`
- Query payload:
  - `page`, `region`, `district`, `is_approved`, `is_active`, `search`, `ordering`
- Response: paginated farmer records.

Farmer item shape:
```json
{
  "id": 18,
  "profile_picture": null,
  "full_name": "Kwame Mensah",
  "mobile_number": "+233241234567",
  "ghana_card_number": "GHA-123456789-0",
  "gps_latitude": "5.603700",
  "gps_longitude": "-0.187000",
  "region": "Greater Accra",
  "district": "Accra Metropolitan",
  "community": "Adenta",
  "maize_types_supplied": "Yellow Maize",
  "notes": "",
  "is_approved": true,
  "is_active": true,
  "created_by": 1,
  "created_by_name": "Admin User",
  "created_at": "2026-03-12T10:00:00Z",
  "updated_at": "2026-03-15T09:00:00Z"
}
```

### 4.2 Product Snapshot (Public/Admin)
- Endpoint: `GET /api/products/`
- Query payload:
  - `q`, `category`, `availability`
  - `sort` (`featured|price_asc|price_desc|name_asc|name_desc`)
  - `page`, `page_size`
- Response: paginated products for product cards/table.

### 4.3 Announcement/News Cards (Public)
- Endpoint: `GET /api/home/announcements-preview/`
- Query payload:
  - `limit` (optional, max 50)
  - `published` (optional, default `true`)

Example response (`200`, non-paginated):
```json
[
  {
    "id": 7,
    "slug": "maize-market-weekly-update",
    "title": "Maize Market Weekly Update",
    "excerpt": "This week we observed stable wholesale maize prices across key districts...",
    "cover_image": null,
    "published_at": "2026-03-19T09:30:00Z",
    "is_published": true
  }
]
```

---

## 5) Error Response Patterns

Validation error example (`400`):
```json
{
  "field_name": ["Error message"]
}
```

Permission error (`401` or `403`):
```json
{
  "detail": "Authentication credentials were not provided."
}
```

Not found (`404`):
```json
{
  "detail": "Not found."
}
```

---

## 6) Suggested Dashboard Fetch Plan

Admin/Staff dashboard:
1. `GET /api/farmers/reports/` (metric cards)
2. `GET /api/inventory/stock/alerts/` (alert widgets)
3. `GET /api/orders/?ordering=-created_at&page=1` (recent orders)
4. `GET /api/inventory/movements/?ordering=-created_at&page=1` (recent activity feed)
5. `GET /api/farmers/?ordering=-created_at&page=1` (recent farmers)

Customer dashboard:
1. `GET /api/customers/me/` (customer profile + totals)
2. `GET /api/orders/history/` (recent personal activity)
3. `GET /api/home/hero-metrics/` (top banner stats, optional)

