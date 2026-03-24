"use client";

import { BASE_URL } from "@/data/constants";

const API_BASE = BASE_URL.replace(/\/+$/, "");

export type ProductSort = "featured" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
export type ProductAvailability = "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";

export type BackendProductCategory = {
  id: string;
  name: string;
};

export type BackendProduct = {
  id: number;
  slug: string;
  name: string;
  category: BackendProductCategory | null;
  maize_type: string;
  description: string;
  packaging_size: string;
  price_per_bag: string;
  price_per_ton: string;
  currency: string;
  availability_status: ProductAvailability;
  min_order_quantity: string;
  image_url: string | null;
  updated_at: string;
};

export type ProductsPaginatedResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BackendProduct[];
};

export type BackendCategory = {
  id: string;
  name: string;
  description?: string | null;
  product_count?: number;
};

export type ProductQueryParams = {
  q?: string;
  category?: string;
  availability?: ProductAvailability;
  sort?: ProductSort;
  page?: number;
  page_size?: number;
};

type ApiError = {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
};

const buildUrl = (path: string, query?: Record<string, string | number | undefined>) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
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

export async function fetchProducts(params: ProductQueryParams, signal?: AbortSignal): Promise<ProductsPaginatedResponse> {
  const url = buildUrl("/products/", params);
  const response = await fetch(url, { method: "GET", signal });
  const data = (await parseJsonSafe(response)) as ProductsPaginatedResponse | ApiError | null;

  if (!response.ok) {
    throw {
      message: parseErrorMessage(data, "Unable to load products."),
      status: response.status,
      data,
    };
  }

  return data as ProductsPaginatedResponse;
}

export async function fetchProductCategories(signal?: AbortSignal): Promise<BackendCategory[]> {
  const url = buildUrl("/product-categories/");
  const response = await fetch(url, { method: "GET", signal });
  const data = (await parseJsonSafe(response)) as BackendCategory[] | ApiError | null;

  if (!response.ok) {
    throw {
      message: parseErrorMessage(data, "Unable to load product categories."),
      status: response.status,
      data,
    };
  }

  return Array.isArray(data) ? data : [];
}

async function fetchProductsPage(page: number, pageSize: number, signal?: AbortSignal): Promise<ProductsPaginatedResponse> {
  return fetchProducts({ page, page_size: pageSize }, signal);
}

export async function fetchProductBySlug(slug: string, signal?: AbortSignal): Promise<BackendProduct | null> {
  const safeSlug = slug.trim().toLowerCase();
  if (!safeSlug) return null;

  // Attempt direct detail endpoint first in case backend supports slug lookup.
  const detailUrl = buildUrl(`/products/${safeSlug}/`);
  try {
    const detailResponse = await fetch(detailUrl, { method: "GET", signal });
    const detailData = (await parseJsonSafe(detailResponse)) as BackendProduct | ApiError | null;

    if (detailResponse.ok && detailData && typeof detailData === "object" && "slug" in detailData) {
      return detailData as BackendProduct;
    }
  } catch {
    // Ignore and continue with list fallback.
  }

  // Fallback: scan paginated list endpoint for exact slug match.
  const pageSize = 100;
  const firstPage = await fetchProductsPage(1, pageSize, signal);
  const firstMatch = firstPage.results.find((product) => product.slug.toLowerCase() === safeSlug);
  if (firstMatch) return firstMatch;

  const totalPages = Math.ceil(firstPage.count / pageSize);
  for (let page = 2; page <= totalPages; page += 1) {
    const pageData = await fetchProductsPage(page, pageSize, signal);
    const match = pageData.results.find((product) => product.slug.toLowerCase() === safeSlug);
    if (match) return match;
  }

  return null;
}
