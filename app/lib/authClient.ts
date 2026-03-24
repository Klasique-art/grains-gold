"use client";

import { BASE_URL } from "@/data/constants";

const API_BASE = BASE_URL.replace(/\/+$/, "");

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";
const AUTH_LOG_PREFIX = "[authClient]";

type TokenPair = {
  access: string | null;
  refresh: string | null;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  whatsapp_number?: string | null;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  user_type: "CUSTOMER" | "STAFF" | "ADMIN";
  profile_picture: string | null;
  mobile_number: string;
  whatsapp_number: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type RegisterResponse = {
  user: AuthUser;
  tokens: {
    access?: string;
    refresh?: string;
  };
  message?: string;
};

type LoginResponse = {
  access: string;
  refresh: string;
};

type RefreshResponse = {
  access: string;
  refresh?: string;
};

type ApiErrorShape = {
  message?: string;
  detail?: string;
  non_field_errors?: string[] | string;
  errors?: Record<string, string[] | string>;
  [key: string]: unknown;
};

export type ParsedApiError = {
  message: string;
  fields: Record<string, string>;
};

const isBrowser = () => typeof window !== "undefined";

const readToken = (key: string) => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(key);
};

const writeToken = (key: string, value: string) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, value);
};

const removeToken = (key: string) => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
};

export const getTokens = (): TokenPair => ({
  access: readToken(ACCESS_TOKEN_KEY),
  refresh: readToken(REFRESH_TOKEN_KEY),
});

export const setTokens = (tokens: { access?: string; refresh?: string }) => {
  if (tokens.access) writeToken(ACCESS_TOKEN_KEY, tokens.access);
  if (tokens.refresh) writeToken(REFRESH_TOKEN_KEY, tokens.refresh);
};

export const clearTokens = () => {
  removeToken(ACCESS_TOKEN_KEY);
  removeToken(REFRESH_TOKEN_KEY);
};

const parseJsonSafe = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const toFieldErrors = (data: ApiErrorShape | null | undefined): Record<string, string> => {
  if (!data || typeof data !== "object") return {};

  const fields: Record<string, string> = {};

  const collect = (source: Record<string, unknown>) => {
    Object.entries(source).forEach(([key, value]) => {
      if (key === "message" || key === "detail") return;
      if (key === "errors" || key === "non_field_errors") return;

      if (Array.isArray(value)) {
        const first = value.find((item) => typeof item === "string");
        if (typeof first === "string") fields[key] = first;
        return;
      }

      if (typeof value === "string") {
        fields[key] = value;
      }
    });
  };

  collect(data);

  if (data.errors && typeof data.errors === "object") {
    collect(data.errors);
  }

  return fields;
};

export const parseApiError = (error: unknown, fallback = "Something went wrong. Please try again."): ParsedApiError => {
  const data = (error ?? {}) as ApiErrorShape;
  const nonFieldError = Array.isArray(data.non_field_errors)
    ? data.non_field_errors[0]
    : data.non_field_errors;

  const nestedNonField =
    data.errors && typeof data.errors === "object"
      ? ((data.errors.non_field_errors as string[] | string | undefined) ?? undefined)
      : undefined;

  const nestedNonFieldText = Array.isArray(nestedNonField) ? nestedNonField[0] : nestedNonField;

  const message =
    data.message ||
    data.detail ||
    nonFieldError ||
    nestedNonFieldText ||
    fallback;

  return {
    message: typeof message === "string" ? message : fallback,
    fields: toFieldErrors(data),
  };
};

const withBase = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
};

const networkError = (error: unknown, context: string, url: string, method: string) => {
  const err = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : { message: String(error) };

  console.error(`${AUTH_LOG_PREFIX} ${context} network error`, {
    method,
    url,
    error: err,
  });

  return {
    message: "Unable to reach auth server. Confirm backend is running and try again.",
    detail: err.message,
  };
};

async function requestJson<TData>(path: string, init: RequestInit, context: string): Promise<{ response: Response; data: TData | ApiErrorShape | null }> {
  const url = withBase(path);
  const method = init.method ?? "GET";

  try {
    const response = await fetch(url, init);
    const data = (await parseJsonSafe(response)) as TData | ApiErrorShape | null;

    if (!response.ok) {
      console.error(`${AUTH_LOG_PREFIX} ${context} failed`, {
        method,
        url,
        status: response.status,
        statusText: response.statusText,
        response: data,
      });
    }

    return { response, data };
  } catch (error) {
    throw networkError(error, context, url, method);
  }
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { response, data } = await requestJson<RegisterResponse>("/auth/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, "Register");

  if (!response.ok) throw data;

  const tokens = (data as RegisterResponse)?.tokens ?? {};
  setTokens({ access: tokens.access, refresh: tokens.refresh });
  return data as RegisterResponse;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { response, data } = await requestJson<LoginResponse>("/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }, "Login");

  if (!response.ok) throw data;

  setTokens({
    access: (data as LoginResponse).access,
    refresh: (data as LoginResponse).refresh,
  });

  return data as LoginResponse;
}

export async function refreshAccessToken(): Promise<string> {
  const { refresh } = getTokens();
  if (!refresh) throw new Error("No refresh token found");

  const { response, data } = await requestJson<RefreshResponse>("/auth/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  }, "Refresh token");

  if (!response.ok) {
    clearTokens();
    throw data;
  }

  setTokens({
    access: (data as RefreshResponse).access,
    refresh: (data as RefreshResponse).refresh,
  });

  return (data as RefreshResponse).access;
}

export async function authFetch(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  const { access } = getTokens();
  const headers = new Headers(init.headers ?? {});
  const bodyIsFormData = init.body instanceof FormData;
  const url = withBase(path);
  const method = init.method ?? "GET";

  if (!headers.has("Content-Type") && !bodyIsFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (access) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch (error) {
    throw networkError(error, `Request ${path}`, url, method);
  }

  if (response.status === 401 && retry) {
    try {
      const newAccess = await refreshAccessToken();
      headers.set("Authorization", `Bearer ${newAccess}`);
      response = await fetch(url, { ...init, headers });
    } catch (error) {
      console.error(`${AUTH_LOG_PREFIX} Request retry failed`, {
        method,
        url,
        error,
      });
      clearTokens();
      throw { message: "Session expired. Please log in again." };
    }
  }

  return response;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await authFetch("/auth/me/", { method: "GET" });
  const data = (await parseJsonSafe(response)) as AuthUser | ApiErrorShape | null;
  if (!response.ok) throw data;
  return data as AuthUser;
}

export async function logout(): Promise<void> {
  const { refresh } = getTokens();

  try {
    if (refresh) {
      const { response, data } = await requestJson<unknown>("/auth/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }, "Logout");
      if (!response.ok) throw data;
    }
  } finally {
    clearTokens();
  }
}
