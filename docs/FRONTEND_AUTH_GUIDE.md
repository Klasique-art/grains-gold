# Frontend Auth Guide (Register + Login)

## Base URL
- Local API base: `http://127.0.0.1:8000/api`

## Auth Endpoints
- `POST /auth/register/` -> Create normal user account (`CUSTOMER`)
- `POST /auth/login/` -> Login and get JWT tokens
- `POST /auth/refresh/` -> Refresh access token
- `POST /auth/logout/` -> Logout (blacklist refresh token)
- `GET /auth/me/` -> Get current logged-in user profile

Full URLs:
- `http://127.0.0.1:8000/api/auth/register/`
- `http://127.0.0.1:8000/api/auth/login/`
- `http://127.0.0.1:8000/api/auth/refresh/`
- `http://127.0.0.1:8000/api/auth/logout/`
- `http://127.0.0.1:8000/api/auth/me/`

## Register (Normal User)
Endpoint: `POST /api/auth/register/`

Request body:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "StrongPass123!",
  "password2": "StrongPass123!",
  "first_name": "John",
  "last_name": "Doe",
  "mobile_number": "+233241234567",
  "whatsapp_number": "+233241234567"
}
```

Notes:
- `mobile_number` is required.
- Mobile format must start with `+233` (Ghana format).
- `user_type` is set by backend to `CUSTOMER`.

Success response (`201`):
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "user_type": "CUSTOMER",
    "profile_picture": null,
    "mobile_number": "+233241234567",
    "whatsapp_number": "+233241234567",
    "is_verified": false,
    "is_active": true,
    "created_at": "2026-03-20T10:00:00Z",
    "updated_at": "2026-03-20T10:00:00Z"
  },
  "tokens": {
    "refresh": "<refresh_token>",
    "access": "<access_token>"
  },
  "message": "Registration successful. Please check your email for verification."
}
```

## Login
Endpoint: `POST /api/auth/login/`

Request body:
```json
{
  "username": "john_doe",
  "password": "StrongPass123!"
}
```

Success response (`200`):
```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

## Token Refresh
Endpoint: `POST /api/auth/refresh/`

Request body:
```json
{
  "refresh": "<refresh_token>"
}
```

Success response:
```json
{
  "access": "<new_access_token>",
  "refresh": "<possibly_rotated_refresh_token>"
}
```

Note:
- Refresh token rotation is enabled in backend settings.
- Always replace stored refresh token if backend returns a new one.

## Auth Header for Protected APIs
Send access token as Bearer:
```http
Authorization: Bearer <access_token>
```

Example:
`GET /api/auth/me/`

## Frontend Implementation Pattern
1. Register or login.
2. Save `access` and `refresh` tokens.
3. Use `Authorization: Bearer <access>` for protected calls.
4. On `401`, call `/auth/refresh/`.
5. Retry failed request once with new access token.
6. If refresh fails, clear tokens and redirect to login.

## Minimal API Client (TypeScript)
```ts
const API_BASE = "http://127.0.0.1:8000/api";

type Json = Record<string, unknown>;

function getTokens() {
  return {
    access: localStorage.getItem("access"),
    refresh: localStorage.getItem("refresh"),
  };
}

function setTokens(tokens: { access?: string; refresh?: string }) {
  if (tokens.access) localStorage.setItem("access", tokens.access);
  if (tokens.refresh) localStorage.setItem("refresh", tokens.refresh);
}

function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export async function register(payload: Json) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;

  const tokens = (data.tokens ?? {}) as { access?: string; refresh?: string };
  setTokens(tokens);
  return data;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw data;

  setTokens({ access: data.access, refresh: data.refresh });
  return data;
}

export async function refreshAccessToken() {
  const { refresh } = getTokens();
  if (!refresh) throw new Error("No refresh token found");

  const res = await fetch(`${API_BASE}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const data = await res.json();
  if (!res.ok) {
    clearTokens();
    throw data;
  }

  setTokens({ access: data.access, refresh: data.refresh });
  return data.access as string;
}

export async function authFetch(path: string, init: RequestInit = {}) {
  const { access } = getTokens();

  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (access) headers.set("Authorization", `Bearer ${access}`);

  let res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    try {
      const newAccess = await refreshAccessToken();
      headers.set("Authorization", `Bearer ${newAccess}`);
      res = await fetch(`${API_BASE}${path}`, { ...init, headers });
    } catch {
      clearTokens();
      throw new Error("Session expired. Please log in again.");
    }
  }

  return res;
}
```

## Example Usage
```ts
// Login screen submit
await login(form.username, form.password);

// Protected route
const meRes = await authFetch("/auth/me/", { method: "GET" });
const me = await meRes.json();
```

## Common Pitfalls
- Sending email instead of username to `/auth/login/` (backend expects `username`).
- Not including `+233` prefix for `mobile_number` during registration.
- Forgetting `Bearer ` prefix in `Authorization` header.
- Not updating refresh token when rotation returns a new one.

