import { productFaqs } from "@/data/static.products";
import ProductsSectionHeader from "./ProductsSectionHeader";

const ProductsFaqSection = () => {
  return (
    <section aria-labelledby="products-faq-title" className="bg-linear-to-b from-secondary/5 to-white">
      <div className="inner-wrapper space-y-6">
        <ProductsSectionHeader
          id="products-faq-title"
          eyebrow="FAQ"
          title="Common questions about products and ordering"
          description="Answers to the most frequent questions before checkout."
        />

        <div className="space-y-3">
          {productFaqs.map((faq) => (
            <details key={faq.id} className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer list-none text-sm font-black text-primary">
                <span>{faq.question}</span>
              </summary>
              <p className="mt-2 text-sm text-primary/80">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsFaqSection;

