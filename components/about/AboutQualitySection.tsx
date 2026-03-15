import { aboutQualityPillars } from "@/data/static.about";
import AboutSectionHeader from "./AboutSectionHeader";

const AboutQualitySection = () => {
  return (
    <section aria-labelledby="about-quality-title" className="bg-linear-to-b from-secondary/5 to-white">
      <div className="inner-wrapper space-y-6">
        <AboutSectionHeader
          id="about-quality-title"
          eyebrow="Quality & Fulfillment"
          title="How we protect product integrity from source to delivery"
          description="Operational checks designed to give customers confidence in every order."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aboutQualityPillars.map((pillar) => (
            <article key={pillar.id} className="rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h3 className="text-base font-black text-primary">{pillar.title}</h3>
              <p className="mt-2 text-sm text-primary/80">{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutQualitySection;

