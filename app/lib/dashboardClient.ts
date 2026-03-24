"use client";

import { BASE_URL } from "@/data/constants";
import { authFetch } from "@/app/lib/authClient";

const API_BASE = BASE_URL.replace(/\/+$/, "");

type ApiError = {
  detail?: string;
  message?: string;
};

export type CustomerMeResponse = {
  customer_id: string;
  location: string;
  total_orders: number;
  total_spent: string;
  user: {
    full_name: string;
    email: string;
    mobile_number: string;
  };
};

export type HeroMetricsResponse = {
  partner_farmers_count: number;
  avg_delivery_window: string;
  repeat_customer_rate: string;
  last_updated: string;
};

export type CustomerOrderHistoryItem = {
  id: number;
  order_id: string;
  product: number;
  product_details?: {
    name?: string;
  } | null;
  quantity_bags: number;
  total_price: string;
  delivery_date: string;
  payment_option: string;
  order_status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
  created_at: string;
};

export type AnnouncementPreviewItem = {
  id: number;
  title: string;
  excerpt: string;
  published_at: string;
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

const parseErrorMessage = (error: unknown, fallback: string) => {
  const data = (error ?? {}) as ApiError;
  return data.detail || data.message || fallback;
};

const publicUrl = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
};

export async function fetchCustomerMe(): Promise<CustomerMeResponse> {
  const response = await authFetch("/customers/me/", { method: "GET" });
  const data = (await parseJsonSafe(response)) as CustomerMeResponse | ApiError | null;
  if (!response.ok) {
    throw {
      message: parseErrorMessage(data, "Unable to load customer profile."),
      status: response.status,
      data,
    };
  }
  return data as CustomerMeResponse;
}

export async function fetchHeroMetrics(): Promise<HeroMetricsResponse> {
  const response = await fetch(publicUrl("/home/hero-metrics/"), { method: "GET" });
  const data = (await parseJsonSafe(response)) as HeroMetricsResponse | ApiError | null;
  if (!response.ok) {
    throw {
      message: parseErrorMessage(data, "Unable to load hero metrics."),
      status: response.status,
      data,
    };
  }
  return data as HeroMetricsResponse;
}

export async function fetchOrdersHistory(): Promise<CustomerOrderHistoryItem[]> {
  const response = await authFetch("/orders/history/", { method: "GET" });
  const data = (await parseJsonSafe(response)) as CustomerOrderHistoryItem[] | ApiError | null;
  if (!response.ok) {
    throw {
      message: parseErrorMessage(data, "Unable to load order history."),
      status: response.status,
      data,
    };
  }

  return Array.isArray(data) ? data : [];
}

export async function fetchAnnouncementsPreview(limit = 3): Promise<AnnouncementPreviewItem[]> {
  const response = await fetch(publicUrl(`/home/announcements-preview/?limit=${limit}`), { method: "GET" });
  const data = (await parseJsonSafe(response)) as AnnouncementPreviewItem[] | ApiError | null;
  if (!response.ok) {
    throw {
      message: parseErrorMessage(data, "Unable to load announcements."),
      status: response.status,
      data,
    };
  }

  return Array.isArray(data) ? data : [];
}
