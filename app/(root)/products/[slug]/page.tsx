"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BackendProduct, fetchProductBySlug, fetchProducts, ProductAvailability } from "@/app/lib/productsClient";
import { placeholderImage } from "@/data/constants";

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

const formatPrice = (price: string, currency = "GHS") => {
  const numeric = Number.parseFloat(price);
  if (Number.isNaN(numeric)) {
    return price;
  }

  return `${currency} ${numeric.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const ProductDetailsPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => decodeURIComponent(params.slug ?? ""), [params.slug]);

  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorMessage("");

    const loadData = async () => {
      try {
        const target = await fetchProductBySlug(slug, controller.signal);

        if (!target) {
          setProduct(null);
          setRelatedProducts([]);
          setErrorMessage("Product not found.");
          return;
        }

        setProduct(target);

        const related = await fetchProducts(
          {
            category: target.category?.id,
            page: 1,
            page_size: 4,
          },
          controller.signal,
        );

        setRelatedProducts(related.results.filter((item) => item.slug !== target.slug).slice(0, 3));
      } catch (error) {
        if (controller.signal.aborted) return;

        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message: unknown }).message)
            : "Unable to load product details.";

        setProduct(null);
        setRelatedProducts([]);
        setErrorMessage(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      controller.abort();
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="bg-white">
        <div className="inner-wrapper">
          <div className="rounded-2xl border border-secondary/20 bg-white p-5 text-sm text-primary/75">Loading product details...</div>
        </div>
      </section>
    );
  }

  if (errorMessage || !product) {
    return (
      <section className="bg-white">
        <div className="inner-wrapper space-y-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">{errorMessage || "Product not found."}</p>
          </div>
          <Link
            href="/products"
            className="inline-flex rounded-lg border border-secondary/40 px-4 py-2 text-sm font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white">
        <div className="inner-wrapper space-y-6">
          <nav aria-label="Breadcrumb" className="text-sm text-primary/75">
            <Link href="/products" className="font-semibold text-primary underline decoration-accent-2 underline-offset-4">
              Products
            </Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span>{product.name}</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-3xl border border-secondary/20 bg-white shadow-sm">
              <Image
                src={product.image_url || placeholderImage}
                alt={`${product.name} detailed maize image`}
                width={1400}
                height={900}
                className="h-[320px] w-full object-cover sm:h-[460px]"
                priority
              />
            </div>

            <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">{product.maize_type}</p>
              <h1 className="mt-2 text-3xl font-black text-primary sm:text-4xl">{product.name}</h1>
              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${availabilityClassMap[product.availability_status]}`}
                aria-label={`Availability: ${availabilityLabelMap[product.availability_status]}`}
              >
                {availabilityLabelMap[product.availability_status]}
              </span>

              <p className="mt-4 text-sm text-primary/85 sm:text-base">{product.description}</p>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/75">Category</dt>
                  <dd className="text-sm font-bold text-primary">{product.category?.name ?? "General"}</dd>
                </div>
                <div className="rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/75">Packaging</dt>
                  <dd className="text-sm font-bold text-primary">{product.packaging_size}</dd>
                </div>
                <div className="rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/75">Price per bag</dt>
                  <dd className="text-sm font-bold text-primary">{formatPrice(product.price_per_bag, product.currency)}</dd>
                </div>
                <div className="rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/75">Price per ton</dt>
                  <dd className="text-sm font-bold text-primary">{formatPrice(product.price_per_ton, product.currency)}</dd>
                </div>
                <div className="rounded-lg bg-secondary/8 px-3 py-2 sm:col-span-2">
                  <dt className="text-xs text-primary/75">Minimum order quantity</dt>
                  <dd className="text-sm font-bold text-primary">{product.min_order_quantity}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/place-order?product=${product.id}`}
                  className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                >
                  Order Now
                </Link>
                <Link
                  href="/contact#quote"
                  className="rounded-lg border border-accent-2 px-4 py-2 text-sm font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                >
                  Request Quote
                </Link>
                <Link
                  href="/products"
                  className="rounded-lg border border-secondary/40 px-4 py-2 text-sm font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                >
                  Back to Products
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-white to-secondary/5">
        <div className="inner-wrapper space-y-4">
          <h2 className="text-2xl font-black text-primary">Related Products</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {relatedProducts.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-2xl border border-secondary/20 bg-white shadow-sm">
                  <Image
                    src={item.image_url || placeholderImage}
                    alt={`${item.name} related product image`}
                    width={900}
                    height={600}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-base font-black text-primary">{item.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-secondary">{item.maize_type}</p>
                    <p className="mt-2 text-sm font-semibold text-primary">{formatPrice(item.price_per_ton, item.currency)} per ton</p>
                    <Link
                      href={`/products/${item.slug}`}
                      className="mt-3 inline-flex text-sm font-bold text-primary underline decoration-accent-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                    >
                      View details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-primary/75">No related products available right now.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;
