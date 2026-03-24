"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BackendProduct, ProductAvailability, fetchProducts } from "@/app/lib/productsClient";
import HomeSectionHeader from "./HomeSectionHeader";

const availabilityClassMap: Record<ProductAvailability, string> = {
  AVAILABLE: "bg-secondary/15 text-primary border-secondary/40",
  LOW_STOCK: "bg-accent-2/30 text-primary border-accent-2",
  OUT_OF_STOCK: "bg-black/10 text-black border-black/40",
};

const availabilityLabelMap: Record<ProductAvailability, string> = {
  AVAILABLE: "Available",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const formatMoney = (value: string, currency: string) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return `${currency} ${value}`;
  return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
};

const HomeProductsSection = () => {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetchProducts({ page: 1, page_size: 3, sort: "featured" });
        if (!mounted) return;
        setProducts(response.results);
      } catch (error) {
        if (!mounted) return;
        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message: unknown }).message)
            : "Unable to load product listings.";
        setErrorMessage(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section aria-labelledby="home-products-title" className="bg-linear-to-b from-white to-secondary/5">
      <div className="inner-wrapper space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <HomeSectionHeader
            id="home-products-title"
            eyebrow="Products"
            title="Current maize listings with clear market-ready pricing"
            description="Order now stays visible, and checkout starts after login. Browse this snapshot or open the complete products page."
          />
          <Link
            href="/products"
            className="rounded-xl border border-secondary/40 bg-white px-4 py-2 text-sm font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            Full Price List
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl border border-secondary/20 bg-white p-4 text-sm text-primary/80">Loading current listings...</div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{errorMessage}</div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-secondary/20 bg-white p-4 text-sm text-primary/80">No products available right now.</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-black text-primary">{product.name}</h3>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${availabilityClassMap[product.availability_status]}`}>
                    {availabilityLabelMap[product.availability_status]}
                  </span>
                </div>

                <p className="mt-2 text-sm text-primary/80">{product.description || "No description available."}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">{product.packaging_size}</p>

                <dl className="mt-3 grid gap-2">
                  <div className="flex items-center justify-between rounded-lg bg-secondary/8 px-3 py-2">
                    <dt className="text-xs text-primary/80">Price per bag</dt>
                    <dd className="text-sm font-black text-primary">{formatMoney(product.price_per_bag, product.currency)}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-secondary/8 px-3 py-2">
                    <dt className="text-xs text-primary/80">Price per ton</dt>
                    <dd className="text-sm font-black text-primary">{formatMoney(product.price_per_ton, product.currency)}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex gap-2">
                  <Link
                    href="/dashboard/place-order"
                    className="rounded-lg border border-primary bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                  >
                    Order Now
                  </Link>
                  <Link
                    href="/contact#quote"
                    className="rounded-lg border border-secondary/40 px-4 py-2 text-xs font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                  >
                    Request Quote
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeProductsSection;
