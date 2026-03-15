"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { productCategories, productItems } from "@/data/static.products";
import ProductsSectionHeader from "./ProductsSectionHeader";

const ProductsCategoriesSection = () => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";

  const withCategoryQuery = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    params.set("page", "1");
    const query = params.toString();
    return query ? `/products?${query}#products-list-title` : "/products#products-list-title";
  };

  const categoryCount = (categoryId: string) =>
    categoryId === "all" ? productItems.length : productItems.filter((item) => item.categoryId === categoryId).length;

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
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">{categoryCount("all")} items</p>
          </Link>

          {productCategories.map((category) => (
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
                {categoryCount(category.id)} items
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsCategoriesSection;
