import Link from "next/link";

const ProductsCtaSection = () => {
  return (
    <section aria-labelledby="products-cta-title" className="bg-primary">
      <div className="inner-wrapper">
        <div className="rounded-3xl border border-white/20 bg-linear-to-r from-primary via-secondary to-primary p-6 sm:p-8">
          <h2 id="products-cta-title" className="text-2xl font-black text-white sm:text-3xl">
            Ready to place your maize order?
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Log in to place orders and track status, or request a custom quote for larger volume needs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-white bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-accent-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              Login to Order
            </Link>
            <Link
              href="/contact#quote"
              className="rounded-xl border border-accent-2 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              Request Bulk Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsCtaSection;

