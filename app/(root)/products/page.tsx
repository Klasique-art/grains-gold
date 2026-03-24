import { Suspense } from "react";

import {
  ProductsCategoriesSection,
  ProductsCtaSection,
  ProductsFaqSection,
  ProductsGridSection,
  ProductsHeroSection,
  ProductsTableSection,
} from "@/components";

const ProductsFiltersFallback = () => (
  <section className="bg-white">
    <div className="inner-wrapper">
      <div className="rounded-2xl border border-secondary/20 bg-white p-5 text-sm text-primary/75">
        Loading product filters...
      </div>
    </div>
  </section>
);

const ProductsPage = () => {
  return (
    <>
      <ProductsHeroSection />
      <Suspense fallback={<ProductsFiltersFallback />}>
        <ProductsCategoriesSection />
        <ProductsGridSection />
        <ProductsTableSection />
      </Suspense>
      <ProductsFaqSection />
      <ProductsCtaSection />
    </>
  );
};

export default ProductsPage;
