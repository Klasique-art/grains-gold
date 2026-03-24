"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { fetchProducts, ProductSort, ProductsPaginatedResponse } from "@/app/lib/productsClient";
import { placeholderImage } from "@/data/constants";
import { ProductAvailability } from "@/types";
import ProductsSectionHeader from "./ProductsSectionHeader";

const availabilityClassMap: Record<ProductAvailability, string> = {
  AVAILABLE: "border-secondary/40 bg-secondary/15 text-primary",
  LOW_STOCK: "border-accent-2 bg-accent-2/30 text-primary",
  OUT_OF_STOCK: "border-black/40 bg-black/10 text-black",
};

const availabilityLabelMap: Record<ProductAvailability, string> = {
  AVAILABLE: "Available",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const validSortValues: ProductSort[] = ["featured", "price_asc", "price_desc", "name_asc", "name_desc"];
const validAvailabilityValues: ProductAvailability[] = ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK"];
const validPageSizes = [4, 6, 12];

const normalizePageValue = (value: string | null) => {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

const normalizePageSizeValue = (value: string | null) => {
  const parsed = Number.parseInt(value ?? "12", 10);
  if (Number.isNaN(parsed)) return 12;
  if (!validPageSizes.includes(parsed)) return 12;
  return parsed;
};

const formatPrice = (price: string, currency = "GHS") => {
  const numeric = Number.parseFloat(price);
  if (Number.isNaN(numeric)) {
    return price;
  }
  return `${currency} ${numeric.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ProductsGridSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [productsResponse, setProductsResponse] = useState<ProductsPaginatedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const category = searchParams.get("category") ?? "all";
  const availability = useMemo(() => {
    const value = searchParams.get("availability");
    if (!value) return "all";
    return validAvailabilityValues.includes(value as ProductAvailability) ? value : "all";
  }, [searchParams]);
  const sort = useMemo(() => {
    const value = searchParams.get("sort");
    if (!value) return "featured";
    return validSortValues.includes(value as ProductSort) ? (value as ProductSort) : "featured";
  }, [searchParams]);
  const query = searchParams.get("q") ?? "";
  const page = normalizePageValue(searchParams.get("page"));
  const pageSize = normalizePageSizeValue(searchParams.get("page_size"));

  const updateQueryParams = (updates: Record<string, string | null>, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (
        !value ||
        value === "all" ||
        value === "featured" ||
        (key === "page" && value === "1") ||
        (key === "page_size" && value === "12")
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    if (resetPage) {
      params.delete("page");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorMessage("");

    const request = async () => {
      try {
        const response = await fetchProducts(
          {
            q: query.trim() || undefined,
            category: category !== "all" ? category : undefined,
            availability: availability !== "all" ? (availability as ProductAvailability) : undefined,
            sort,
            page,
            page_size: pageSize,
          },
          controller.signal,
        );

        setProductsResponse(response);
      } catch (error) {
        if (controller.signal.aborted) return;

        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message: unknown }).message)
            : "Unable to load products right now.";

        setProductsResponse(null);
        setErrorMessage(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void request();

    return () => {
      controller.abort();
    };
  }, [availability, category, page, pageSize, query, sort]);

  const totalCount = productsResponse?.count ?? 0;
  const paginatedProducts = productsResponse?.results ?? [];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const normalizedPage = Math.min(page, totalPages);

  useEffect(() => {
    if (!productsResponse) return;
    if (page <= totalPages) return;
    updateQueryParams({ page: String(totalPages) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, productsResponse, totalPages]);

  const goToPage = (nextPage: number) => {
    updateQueryParams({ page: String(nextPage) });
  };

  return (
    <section aria-labelledby="products-list-title" className="bg-linear-to-b from-white to-secondary/5">
      <div className="inner-wrapper space-y-6">
        <ProductsSectionHeader
          id="products-list-title"
          eyebrow="All Listings"
          title="Product cards with packaging, prices, and availability status"
          description="Order actions remain visible for convenience. Signing in is required to complete checkout."
        />

        <div className="grid gap-3 rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-primary/70">Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => updateQueryParams({ q: event.target.value || null }, true)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full rounded-lg border border-secondary/35 bg-white px-3 py-2 text-sm text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-primary/70">Availability</span>
            <select
              value={availability}
              onChange={(event) => updateQueryParams({ availability: event.target.value }, true)}
              aria-label="Filter by availability"
              className="w-full rounded-lg border border-secondary/35 bg-white px-3 py-2 text-sm text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              <option value="all">All statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="LOW_STOCK">Low stock</option>
              <option value="OUT_OF_STOCK">Out of stock</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-primary/70">Sort</span>
            <select
              value={sort}
              onChange={(event) => updateQueryParams({ sort: event.target.value }, true)}
              aria-label="Sort products"
              className="w-full rounded-lg border border-secondary/35 bg-white px-3 py-2 text-sm text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="name_asc">Name (A to Z)</option>
              <option value="name_desc">Name (Z to A)</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-primary/70">Per page</span>
            <select
              value={String(pageSize)}
              onChange={(event) => updateQueryParams({ page_size: event.target.value }, true)}
              aria-label="Products per page"
              className="w-full rounded-lg border border-secondary/35 bg-white px-3 py-2 text-sm text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              <option value="4">4 items</option>
              <option value="6">6 items</option>
              <option value="12">12 items</option>
            </select>
          </label>
        </div>

        <p className="text-sm text-primary/75" aria-live="polite">
          {loading
            ? "Loading products..."
            : `Showing ${paginatedProducts.length} of ${totalCount} result${totalCount === 1 ? "" : "s"}.`}
        </p>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">{errorMessage}</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {paginatedProducts.map((product) => (
              <article id={product.slug} key={product.id} className="overflow-hidden rounded-2xl border border-secondary/20 bg-white shadow-sm">
                <Image
                  src={product.image_url || placeholderImage}
                  alt={`${product.name} maize product image`}
                  width={1200}
                  height={700}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-primary">{product.name}</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">{product.maize_type}</p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${availabilityClassMap[product.availability_status]}`}
                      aria-label={`Availability: ${availabilityLabelMap[product.availability_status]}`}
                    >
                      {availabilityLabelMap[product.availability_status]}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-primary/80">{product.description}</p>

                  <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg bg-secondary/8 px-3 py-2">
                      <dt className="text-xs text-primary/75">Packaging</dt>
                      <dd className="text-sm font-bold text-primary">{product.packaging_size}</dd>
                    </div>
                    <div className="rounded-lg bg-secondary/8 px-3 py-2">
                      <dt className="text-xs text-primary/75">Minimum order</dt>
                      <dd className="text-sm font-bold text-primary">{product.min_order_quantity}</dd>
                    </div>
                    <div className="rounded-lg bg-secondary/8 px-3 py-2">
                      <dt className="text-xs text-primary/75">Price per bag</dt>
                      <dd className="text-sm font-bold text-primary">{formatPrice(product.price_per_bag, product.currency)}</dd>
                    </div>
                    <div className="rounded-lg bg-secondary/8 px-3 py-2">
                      <dt className="text-xs text-primary/75">Price per ton</dt>
                      <dd className="text-sm font-bold text-primary">{formatPrice(product.price_per_ton, product.currency)}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                      href={`/dashboard/place-order?product=${product.id}`}
                      className="rounded-lg border border-primary bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                    >
                      Order Now
                    </Link>
                    <Link
                      href={`/products/${product.slug}`}
                      className="rounded-lg border border-secondary/40 px-4 py-2 text-xs font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                    >
                      View Details
                    </Link>
                    <Link
                      href="/contact#quote"
                      className="rounded-lg border border-accent-2 px-4 py-2 text-xs font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !errorMessage && totalCount === 0 ? (
          <div className="rounded-2xl border border-secondary/20 bg-white p-8 text-center">
            <p className="text-base font-semibold text-primary">No products match your current filters.</p>
            <p className="mt-1 text-sm text-primary/75">Try adjusting search, availability, or selected category.</p>
          </div>
        ) : null}

        <nav aria-label="Products pagination" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-secondary/20 bg-white p-4">
          <button
            type="button"
            onClick={() => goToPage(normalizedPage - 1)}
            disabled={normalizedPage <= 1 || loading}
            className="rounded-lg border border-secondary/40 px-4 py-2 text-sm font-bold text-primary transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            Previous
          </button>

          <p className="text-sm font-semibold text-primary/80">
            Page {normalizedPage} of {totalPages}
          </p>

          <button
            type="button"
            onClick={() => goToPage(normalizedPage + 1)}
            disabled={normalizedPage >= totalPages || loading}
            className="rounded-lg border border-secondary/40 px-4 py-2 text-sm font-bold text-primary transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  );
};

export default ProductsGridSection;
