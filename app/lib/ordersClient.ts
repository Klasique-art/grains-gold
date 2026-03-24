"use client";

import { authFetch } from "@/app/lib/authClient";

type ApiError = {
  detail?: string;
  message?: string;
  [key: string]: unknown;
};

export type CreateOrderPayload = {
  product: number;
  quantity_bags: number;
  quantity_tons: string;
  unit_price: string;
  delivery_method: "PICKUP" | "DELIVERY";
  delivery_address?: string;
  payment_option: "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY";
  customer_notes?: string;
};

export type OrderStatus = "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
export type DeliveryMethod = "PICKUP" | "DELIVERY";
export type PaymentOption = "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY";

export type OrderItem = {
  id: number;
  order_id: string;
  product: number;
  product_details?: {
    name?: string;
  } | null;
  quantity_bags: number;
  quantity_tons: string;
  unit_price: string;
  total_price: string;
  delivery_method: DeliveryMethod;
  delivery_address: string;
  delivery_date: string;
  payment_option: PaymentOption;
  order_status: OrderStatus;
  customer_notes: string;
  admin_notes: string;
  approved_by_name: string;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrdersPaginatedResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrderItem[];
};

export type GetOrdersParams = {
  page?: number;
  page_size?: number;
  order_status?: OrderStatus;
  delivery_method?: DeliveryMethod;
  ordering?: "-created_at" | "created_at" | "-total_price" | "total_price";
  search?: string;
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

const parseMessage = (error: unknown, fallback: string) => {
  const data = (error ?? {}) as ApiError;
  return data.detail || data.message || fallback;
};

export async function createOrder(payload: CreateOrderPayload): Promise<unknown> {
  const response = await authFetch("/orders/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw {
      message: parseMessage(data, "Unable to place order."),
      status: response.status,
      data,
    };
  }

  return data;
}

export async function getMyOrdersPage(params: GetOrdersParams): Promise<OrdersPaginatedResponse> {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.order_status) query.set("order_status", params.order_status);
  if (params.delivery_method) query.set("delivery_method", params.delivery_method);
  if (params.ordering) query.set("ordering", params.ordering);
  if (params.search?.trim()) query.set("search", params.search.trim());

  const suffix = query.toString();
  const path = suffix ? `/orders/?${suffix}` : "/orders/";
  const response = await authFetch(path, { method: "GET" });
  const data = (await parseJsonSafe(response)) as OrdersPaginatedResponse | ApiError | null;

  if (!response.ok) {
    throw {
      message: parseMessage(data, "Unable to load orders."),
      status: response.status,
      data,
    };
  }

  return data as OrdersPaginatedResponse;
}

export async function getMyOrderHistory(): Promise<OrderItem[]> {
  const response = await authFetch("/orders/history/", { method: "GET" });
  const data = (await parseJsonSafe(response)) as OrderItem[] | ApiError | null;

  if (!response.ok) {
    throw {
      message: parseMessage(data, "Unable to load order history."),
      status: response.status,
      data,
    };
  }

  return Array.isArray(data) ? data : [];
}

export async function cancelOrder(orderId: number, admin_notes = ""): Promise<unknown> {
  const response = await authFetch(`/orders/${orderId}/cancel/`, {
    method: "PATCH",
    body: JSON.stringify({ admin_notes }),
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw {
      message: parseMessage(data, "Unable to cancel order."),
      status: response.status,
      data,
    };
  }

  return data;
}
