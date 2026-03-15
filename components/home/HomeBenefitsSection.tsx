import { homeBenefits } from "@/data/static.home";
import HomeSectionHeader from "./HomeSectionHeader";

const HomeBenefitsSection = () => {
  return (
    <section aria-labelledby="home-benefits-title" className="bg-white">
      <div className="inner-wrapper space-y-6">
        <HomeSectionHeader
          id="home-benefits-title"
          eyebrow="Why Customers Choose Us"
          title="Built for transparent buying and dependable supply"
          description="From first-time household buyers to recurring bulk customers, our process is designed for confidence, speed, and consistency."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {homeBenefits.map((benefit) => (
            <article key={benefit.id} className="rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black text-primary">{benefit.title}</h3>
              <p className="mt-2 text-sm text-primary/80">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBenefitsSection;
