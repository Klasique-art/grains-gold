import AboutSectionHeader from "./AboutSectionHeader";

const AboutStorySection = () => {
  return (
    <section aria-labelledby="about-story-title" className="bg-white">
      <div className="inner-wrapper grid gap-6 lg:grid-cols-2">
        <AboutSectionHeader
          id="about-story-title"
          eyebrow="Our Story"
          title="From sourcing challenge to dependable marketplace"
          description="We started by solving a practical problem: customers needed reliable maize quality and predictable pricing without fragmented sourcing."
        />

        <div className="space-y-4 rounded-2xl border border-secondary/20 bg-white p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-primary/85">
            What began as a focused sourcing operation has grown into a structured supply platform serving households,
            retailers, and processing businesses. Over time, we invested in better quality workflows, clearer customer
            communication, and stronger logistics coordination.
          </p>
          <p className="text-sm leading-relaxed text-primary/85">
            Today, our team continues to improve the buying experience through product transparency, account-based ordering,
            and status visibility, while keeping the core promise simple: dependable maize supply you can plan around.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutStorySection;

