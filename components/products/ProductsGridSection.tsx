"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { placeholderImage } from "@/data/constants";
import { productItems } from "@/data/static.products";
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

const parseNumericPrice = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
};

const ProductsGridSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "all";
  const availability = searchParams.get("availability") ?? "all";
  const sort = searchParams.get("sort") ?? "featured";
  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.max(1, Number.parseInt(searchParams.get("page_size") ?? "4", 10) || 4);

  const updateQueryParams = (updates: Record<string, string | null>, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all" || value === "featured") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    if (resetPage) {
      params.set("page", "1");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  const filteredAndSortedProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = productItems.filter((product) => {
      const categoryMatch = category === "all" || product.categoryId === category;
      const availabilityMatch = availability === "all" || product.availability === availability;
      const textMatch =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.summary.toLowerCase().includes(normalizedQuery) ||
        product.maizeType.toLowerCase().includes(normalizedQuery);

      return categoryMatch && availabilityMatch && textMatch;
    });

    const sorted = [...filtered];
    if (sort === "price_asc") {
      sorted.sort((a, b) => parseNumericPrice(a.pricePerTon) - parseNumericPrice(b.pricePerTon));
    } else if (sort === "price_desc") {
      sorted.sort((a, b) => parseNumericPrice(b.pricePerTon) - parseNumericPrice(a.pricePerTon));
    } else if (sort === "name_asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name_desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  }, [availability, category, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);
  const startIndex = (normalizedPage - 1) * pageSize;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + pageSize);

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
          Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} result
          {filteredAndSortedProducts.length === 1 ? "" : "s"}.
        </p>

        <div className="grid gap-4 lg:grid-cols-3">
          {paginatedProducts.map((product) => (
            <article id={product.slug} key={product.id} className="overflow-hidden rounded-2xl border border-secondary/20 bg-white shadow-sm">
              <Image
                src={product.image || placeholderImage}
                alt={`${product.name} maize product image`}
                width={1200}
                height={700}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-primary">{product.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">{product.maizeType}</p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${availabilityClassMap[product.availability]}`}
                  aria-label={`Availability: ${availabilityLabelMap[product.availability]}`}
                >
                  {availabilityLabelMap[product.availability]}
                </span>
              </div>

              <p className="mt-3 text-sm text-primary/80">{product.summary}</p>

              <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/75">Packaging</dt>
                  <dd className="text-sm font-bold text-primary">{product.packagingSize}</dd>
                </div>
                <div className="rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/75">Minimum order</dt>
                  <dd className="text-sm font-bold text-primary">{product.minOrder}</dd>
                </div>
                <div className="rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/75">Price per bag</dt>
                  <dd className="text-sm font-bold text-primary">{product.pricePerBag}</dd>
                </div>
                <div className="rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/75">Price per ton</dt>
                  <dd className="text-sm font-bold text-primary">{product.pricePerTon}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/login"
                  className="rounded-lg border border-primary bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                >
                  Order Now
                </Link>
                <Link
                  href={`/products#${product.slug}`}
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

        {filteredAndSortedProducts.length === 0 ? (
          <div className="rounded-2xl border border-secondary/20 bg-white p-8 text-center">
            <p className="text-base font-semibold text-primary">No products match your current filters.</p>
            <p className="mt-1 text-sm text-primary/75">Try adjusting search, availability, or selected category.</p>
          </div>
        ) : null}

        <nav aria-label="Products pagination" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-secondary/20 bg-white p-4">
          <button
            type="button"
            onClick={() => goToPage(normalizedPage - 1)}
            disabled={normalizedPage <= 1}
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
            disabled={normalizedPage >= totalPages}
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
