"use client";

import { authFetch } from "@/app/lib/authClient";

type ApiError = {
  detail?: string;
  message?: string;
  errors?: Record<string, string[] | string>;
  non_field_errors?: string[] | string;
  [key: string]: unknown;
};

export type ProfileSettings = {
  id: number | null;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile_number: string;
  whatsapp_number: string;
  location: string;
  profile_picture: string | null;
  profile_picture_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  user_type: "CUSTOMER" | "STAFF" | "ADMIN";
  updated_at: string;
};

export type ProfileUpdatePayload = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile_number: string;
  whatsapp_number?: string | null;
  location: string;
};

export type NotificationPreferences = {
  order_updates: boolean;
  price_alerts: boolean;
  announcements: boolean;
  whatsapp_notifications: boolean;
  updated_at: string;
};

export type NotificationPreferencesUpdatePayload = {
  order_updates: boolean;
  price_alerts: boolean;
  announcements: boolean;
  whatsapp_notifications: boolean;
};

export type PasswordChangePayload = {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
};

type EndpointResult<T> = {
  data: T;
  endpoint: string;
};

const profileReadEndpoints = [
  "/customers/me/profile/",
  "/profile/settings/",
  "/profile/",
  "/customers/me/",
  "/auth/me/",
];

const profileUpdateEndpoints = [
  "/customers/me/profile/",
  "/profile/settings/",
  "/profile/",
  "/customers/me/",
  "/auth/me/",
];

const preferencesEndpoints = [
  "/customers/me/notification-preferences/",
  "/customers/me/preferences/",
  "/profile/notification-preferences/",
  "/profile/preferences/",
];

const passwordChangeEndpoints = [
  "/auth/change-password/",
  "/auth/password/change/",
  "/customers/me/change-password/",
  "/profile/change-password/",
];

const parseJsonSafe = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const parseMessage = (error: unknown, fallback: string) => {
  const data = (error ?? {}) as ApiError;
  if (typeof data.message === "string" && data.message) return data.message;
  if (typeof data.detail === "string" && data.detail) return data.detail;

  const nonField = data.non_field_errors;
  if (Array.isArray(nonField) && typeof nonField[0] === "string") return nonField[0];
  if (typeof nonField === "string") return nonField;

  return fallback;
};

const getString = (value: unknown) => (typeof value === "string" ? value : "");
const getNullableString = (value: unknown) => (typeof value === "string" ? value : null);
const getBoolean = (value: unknown, fallback = false) => (typeof value === "boolean" ? value : fallback);

const normalizeProfile = (raw: unknown): ProfileSettings => {
  const root = (raw ?? {}) as Record<string, unknown>;
  const nestedUser =
    root.user && typeof root.user === "object"
      ? (root.user as Record<string, unknown>)
      : null;

  const src = nestedUser ?? root;

  return {
    id:
      typeof src.id === "number"
        ? src.id
        : typeof root.id === "number"
          ? root.id
          : null,
    first_name: getString(src.first_name),
    last_name: getString(src.last_name),
    username: getString(src.username),
    email: getString(src.email),
    mobile_number: getString(src.mobile_number),
    whatsapp_number: getString(src.whatsapp_number),
    location: getString(root.location),
    profile_picture: getNullableString(src.profile_picture),
    profile_picture_url: getNullableString(root.profile_picture_url) ?? getNullableString(src.profile_picture),
    is_verified: getBoolean(src.is_verified),
    is_active: getBoolean(src.is_active, true),
    user_type: (src.user_type as ProfileSettings["user_type"]) || "CUSTOMER",
    updated_at: getString(root.updated_at) || getString(src.updated_at),
  };
};

const normalizePreferences = (raw: unknown): NotificationPreferences => {
  const value = (raw ?? {}) as Record<string, unknown>;

  return {
    order_updates: getBoolean(value.order_updates),
    price_alerts: getBoolean(value.price_alerts),
    announcements: getBoolean(value.announcements),
    whatsapp_notifications: getBoolean(value.whatsapp_notifications),
    updated_at: getString(value.updated_at),
  };
};

async function requestWithFallback<T>(
  endpoints: string[],
  init: RequestInit,
  context: string,
): Promise<EndpointResult<T>> {
  let lastError: { status: number; data: unknown; endpoint: string } | null = null;

  for (const endpoint of endpoints) {
    const response = await authFetch(endpoint, init);
    const data = await parseJsonSafe(response);

    if (response.ok) {
      return { data: data as T, endpoint };
    }

    if (response.status === 404 || response.status === 405) {
      lastError = { status: response.status, data, endpoint };
      continue;
    }

    throw {
      message: parseMessage(data, `Unable to ${context}.`),
      status: response.status,
      data,
      endpoint,
    };
  }

  throw {
    message: `Unable to ${context}. No compatible backend endpoint was found.`,
    status: lastError?.status ?? 404,
    data: lastError?.data,
    endpoint: lastError?.endpoint,
  };
}

export async function fetchProfileSettings(): Promise<ProfileSettings> {
  const result = await requestWithFallback<unknown>(
    profileReadEndpoints,
    { method: "GET" },
    "load profile settings",
  );

  return normalizeProfile(result.data);
}

export async function updateProfileSettings(payload: ProfileUpdatePayload): Promise<ProfileSettings> {
  const body = {
    ...payload,
    whatsapp_number: payload.whatsapp_number?.trim() || null,
  };

  const result = await requestWithFallback<unknown>(
    profileUpdateEndpoints,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
    "update profile settings",
  );

  return normalizeProfile(result.data);
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  const result = await requestWithFallback<unknown>(
    preferencesEndpoints,
    { method: "GET" },
    "load notification preferences",
  );

  return normalizePreferences(result.data);
}

export async function updateNotificationPreferences(
  payload: NotificationPreferencesUpdatePayload,
): Promise<NotificationPreferences> {
  const result = await requestWithFallback<unknown>(
    preferencesEndpoints,
    {
      method: "PATCH",
      body: JSON.stringify({
        order_updates: payload.order_updates,
        price_alerts: payload.price_alerts,
        announcements: payload.announcements,
        whatsapp_notifications: payload.whatsapp_notifications,
      }),
    },
    "update notification preferences",
  );

  return normalizePreferences(result.data);
}

export async function changePassword(payload: PasswordChangePayload): Promise<{ message: string }> {
  const result = await requestWithFallback<{ message?: string }>(
    passwordChangeEndpoints,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "change password",
  );

  return {
    message: getString(result.data?.message) || "Password changed successfully.",
  };
}
