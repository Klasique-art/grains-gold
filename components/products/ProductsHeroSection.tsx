import Link from "next/link";

const ProductsHeroSection = () => {
  return (
    <section aria-labelledby="products-hero-title" className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[340px] bg-[radial-gradient(circle_at_80%_20%,rgba(120,165,15,0.24),transparent_48%),radial-gradient(circle_at_25%_15%,rgba(249,199,15,0.16),transparent_40%)]"
      />
      <div className="inner-wrapper relative">
        <p className="inline-flex rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-secondary">
          Products
        </p>
        <h1 id="products-hero-title" className="mt-4 max-w-4xl text-3xl font-black leading-tight text-primary sm:text-5xl">
          Public maize listings with clear pricing, packaging, and real-time availability.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-primary/85 sm:text-base">
          Browse all current products and rates per bag/ton without login. When ready, use your customer account to place
          and monitor orders.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-xl border border-primary bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            Create Customer Account
          </Link>
          <Link
            href="/contact#quote"
            className="rounded-xl border border-accent-2 bg-accent-2 px-5 py-3 text-sm font-bold text-primary transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsHeroSection;

