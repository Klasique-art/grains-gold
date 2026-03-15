import { productItems } from "@/data/static.products";
import ProductsSectionHeader from "./ProductsSectionHeader";

const ProductsTableSection = () => {
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
              {productItems.map((item) => (
                <tr key={item.id} className="border-t border-secondary/15">
                  <td className="px-4 py-3 text-sm font-semibold text-primary">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-primary/85">{item.packagingSize}</td>
                  <td className="px-4 py-3 text-sm text-primary/85">{item.pricePerBag}</td>
                  <td className="px-4 py-3 text-sm text-primary/85">{item.pricePerTon}</td>
                  <td className="px-4 py-3 text-sm text-primary/85">{item.availability.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProductsTableSection;

