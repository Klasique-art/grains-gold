"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { fetchProducts, ProductSort, ProductsPaginatedResponse } from "@/app/lib/productsClient";
import { ProductAvailability } from "@/types";
import ProductsSectionHeader from "./ProductsSectionHeader";

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

const ProductsTableSection = () => {
  const searchParams = useSearchParams();
  const [productsResponse, setProductsResponse] = useState<ProductsPaginatedResponse | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

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
      } catch {
        setProductsResponse(null);
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

  const rows = productsResponse?.results ?? [];

  return (
    <section aria-labelledby="products-table-title" className="bg-white">
      <div className="inner-wrapper space-y-6">
        <ProductsSectionHeader
          id="products-table-title"
          eyebrow="Quick Comparison"
          title="Scan all pricing and availability at a glance"
          description="Use this compact view to compare options quickly before placing or requesting orders."
        />

        <div className="overflow-x-auto rounded-2xl border border-secondary/20 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-left">
            <caption className="sr-only">Products comparison table showing packaging, pricing, and availability</caption>
            <thead>
              <tr className="bg-secondary/10">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-primary">Product</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-primary">Packaging</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-primary">Per Bag</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-primary">Per Ton</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-primary">Availability</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-secondary/15">
                  <td className="px-4 py-3 text-sm font-semibold text-primary">
                    <Link
                      href={`/products/${item.slug}`}
                      className="underline decoration-accent-2/80 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary/85">{item.packaging_size}</td>
                  <td className="px-4 py-3 text-sm text-primary/85">{formatPrice(item.price_per_bag, item.currency)}</td>
                  <td className="px-4 py-3 text-sm text-primary/85">{formatPrice(item.price_per_ton, item.currency)}</td>
                  <td className="px-4 py-3 text-sm text-primary/85">{item.availability_status.replace("_", " ")}</td>
                </tr>
              ))}
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-5 text-center text-sm font-medium text-primary/70">
                    No products to display for current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProductsTableSection;
