# Frontend Guide: Profile Settings (Backend-Agnostic Contract)

## Purpose
This document defines what frontend needs to fully support the Profile Settings page.
It intentionally avoids hardcoding backend endpoint paths.
Backend should provide routes that satisfy the contracts below.

## Base Requirements
- Authenticated APIs only (JWT/Bearer session).
- JSON request/response unless file upload is involved.
- Stable field-level error shape for mapping to form inputs.

---

## 1) Profile Read Contract
Frontend needs one authenticated API to load all profile settings data in one call.

### Required response fields
```json
{
  "id": 21,
  "first_name": "John",
  "last_name": "Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "mobile_number": "+233241234567",
  "whatsapp_number": "+233241234567",
  "location": "Accra",
  "profile_picture": null,
  "profile_picture_url": null,
  "is_verified": false,
  "is_active": true,
  "user_type": "CUSTOMER",
  "updated_at": "2026-03-20T16:00:00.000000Z"
}
```

### Notes
- `whatsapp_number` should be nullable/optional.
- `profile_picture_url` is preferred for direct UI rendering.

---

## 2) Profile Update Contract
Frontend needs one authenticated API to update editable profile fields.

### Editable fields expected by frontend
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "john_doe_2",
  "email": "john2@example.com",
  "mobile_number": "+233241111111",
  "whatsapp_number": "+233242222222",
  "location": "Tema"
}
```

### Expected response
- Return the updated full profile object (same shape as profile read).

### Validation expectations
- Email format validation.
- Mobile/WhatsApp format validation (if backend enforces country format).
- Uniqueness checks for username/email.

---

## 3) Password Change Contract
Frontend needs one authenticated API for password updates.

### Request payload expected
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewStrongPass123!",
  "confirm_new_password": "NewStrongPass123!"
}
```

### Expected behavior
- Verify `current_password`.
- Enforce password rules (minimum length, uppercase/lowercase/number).
- Ensure new and confirm passwords match.

### Success response
```json
{
  "message": "Password changed successfully."
}
```

---

## 4) Notification Preferences Contract
Frontend needs a way to read and update notification toggles.

### Read response shape
```json
{
  "order_updates": true,
  "price_alerts": true,
  "announcements": true,
  "whatsapp_notifications": false,
  "updated_at": "2026-03-20T16:00:00.000000Z"
}
```

### Update payload shape
```json
{
  "order_updates": true,
  "price_alerts": false,
  "announcements": true,
  "whatsapp_notifications": true
}
```

### Expected response
- Return updated preferences object.

---

## 5) Profile Picture Contract (Optional but Recommended)
Frontend needs an authenticated upload/update mechanism for avatar.

### Input
- multipart/form-data upload support with one file field.

### Expected response
```json
{
  "profile_picture": "/media/profile_pictures/john.jpg",
  "profile_picture_url": "https://.../media/profile_pictures/john.jpg",
  "updated_at": "2026-03-20T16:00:00.000000Z"
}
```

---

## 6) Error/Validation Contract (Required)
All profile-related APIs should return consistent error shapes.

### Validation error (`400`) example
```json
{
  "message": "Validation failed.",
  "errors": {
    "email": ["Enter a valid email address."],
    "username": ["This username is already taken."],
    "non_field_errors": ["Unable to process request."]
  }
}
```

### Auth error (`401`) example
```json
{
  "message": "Authentication failed.",
  "errors": {
    "auth": ["Authentication credentials were not provided."]
  }
}
```

### Permission error (`403`) example
```json
{
  "message": "Permission denied.",
  "errors": {
    "permission": ["You do not have permission to perform this action."]
  }
}
```

### Frontend mapping rule
- Use first message in `errors[field]` for inline field error.
- Use `non_field_errors` or `message` for top-level toast/alert.

---

## 7) Frontend Integration Plan (When Backend Is Ready)
1. Load profile + preferences in parallel on settings page mount.
2. Bind profile form to returned profile object.
3. Save profile form to profile update API and refresh state with returned object.
4. Save preferences to preferences update API and keep optimistic UI optional.
5. Submit password form to password-change API and clear password inputs on success.
6. If supported, upload profile image and patch UI immediately from returned URL.
7. Handle `401` with refresh-token flow and force re-login if refresh fails.

---

## 8) Frontend Types (Reference)
```ts
export type ProfileSettings = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile_number: string;
  whatsapp_number: string | null;
  location: string;
  profile_picture: string | null;
  profile_picture_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  user_type: "CUSTOMER" | "STAFF" | "ADMIN";
  updated_at: string;
};

export type NotificationPreferences = {
  order_updates: boolean;
  price_alerts: boolean;
  announcements: boolean;
  whatsapp_notifications: boolean;
  updated_at: string;
};
```
