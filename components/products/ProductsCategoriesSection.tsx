"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BackendCategory, fetchProductCategories } from "@/app/lib/productsClient";
import { productCategories } from "@/data/static.products";
import ProductsSectionHeader from "./ProductsSectionHeader";

const ProductsCategoriesSection = () => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";
  const [categories, setCategories] = useState<BackendCategory[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const request = async () => {
      try {
        const data = await fetchProductCategories(controller.signal);
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };

    void request();

    return () => {
      controller.abort();
    };
  }, []);

  const categoryCards = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((category) => ({
        id: category.id,
        title: category.name,
        description: category.description || "Browse products in this category.",
        count: category.product_count,
      }));
    }

    return productCategories.map((category) => ({
      id: category.id,
      title: category.title,
      description: category.description,
      count: undefined,
    }));
  }, [categories]);

  const totalCount = categories.reduce((sum, category) => sum + (category.product_count ?? 0), 0);

  const withCategoryQuery = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    params.delete("page");
    const query = params.toString();
    return query ? `/products?${query}#products-list-title` : "/products#products-list-title";
  };

  return (
    <section aria-labelledby="products-categories-title" className="bg-white">
      <div className="inner-wrapper space-y-6">
        <ProductsSectionHeader
          id="products-categories-title"
          eyebrow="Categories"
          title="Choose product type based on your usage profile"
          description="We organize offerings to help households, retailers, and processors quickly identify the right fit."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={withCategoryQuery("all")}
            aria-current={activeCategory === "all" ? "page" : undefined}
            className={`rounded-2xl border bg-white p-5 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
              activeCategory === "all"
                ? "border-primary ring-1 ring-primary/30 focus-visible:outline-accent-2"
                : "border-secondary/20 hover:border-secondary/40 focus-visible:outline-accent-2"
            }`}
          >
            <h3 className="text-lg font-black text-primary">All Products</h3>
            <p className="mt-2 text-sm text-primary/80">Browse all active listings.</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
              {categories.length > 0 ? `${totalCount} items` : "View listings"}
            </p>
          </Link>

          {categoryCards.map((category) => (
            <Link
              key={category.id}
              href={withCategoryQuery(category.id)}
              aria-current={activeCategory === category.id ? "page" : undefined}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                activeCategory === category.id
                  ? "border-primary ring-1 ring-primary/30 focus-visible:outline-accent-2"
                  : "border-secondary/20 hover:border-secondary/40 focus-visible:outline-accent-2"
              }`}
            >
              <h3 className="text-lg font-black text-primary">{category.title}</h3>
              <p className="mt-2 text-sm text-primary/80">{category.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
                {typeof category.count === "number" ? `${category.count} items` : "View listings"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsCategoriesSection;
