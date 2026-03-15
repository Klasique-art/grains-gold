import { aboutValues } from "@/data/static.about";
import AboutSectionHeader from "./AboutSectionHeader";

const AboutValuesSection = () => {
  return (
    <section aria-labelledby="about-values-title" className="bg-linear-to-b from-white to-secondary/5">
      <div className="inner-wrapper space-y-6">
        <AboutSectionHeader
          id="about-values-title"
          eyebrow="Core Values"
          title="The standards that guide every order and customer interaction"
          description="Our values shape how we source, communicate, and fulfill."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {aboutValues.map((value) => (
            <article key={value.id} className="rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black text-primary">{value.title}</h3>
              <p className="mt-2 text-sm text-primary/80">{value.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValuesSection;

