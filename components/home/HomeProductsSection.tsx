import Link from "next/link";

import { homeProductPreview } from "@/data/static.home";
import HomeSectionHeader from "./HomeSectionHeader";

const availabilityClassMap = {
  Available: "bg-secondary/15 text-primary border-secondary/40",
  "Low Stock": "bg-accent-2/30 text-primary border-accent-2",
  "Out of Stock": "bg-black/10 text-black border-black/40",
};

const HomeProductsSection = () => {
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

        <div className="grid gap-4 lg:grid-cols-3">
          {homeProductPreview.map((product) => (
            <article key={product.id} className="rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-black text-primary">{product.name}</h3>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${availabilityClassMap[product.availability]}`}>
                  {product.availability}
                </span>
              </div>

              <p className="mt-2 text-sm text-primary/80">{product.summary}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">{product.packaging}</p>

              <dl className="mt-3 grid gap-2">
                <div className="flex items-center justify-between rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/80">Price per bag</dt>
                  <dd className="text-sm font-black text-primary">{product.pricePerBag}</dd>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/8 px-3 py-2">
                  <dt className="text-xs text-primary/80">Price per ton</dt>
                  <dd className="text-sm font-black text-primary">{product.pricePerTon}</dd>
                </div>
              </dl>

              <div className="mt-4 flex gap-2">
                <Link
                  href="/login"
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
      </div>
    </section>
  );
};

export default HomeProductsSection;
