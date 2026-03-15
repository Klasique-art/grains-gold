import { homeHowItWorks } from "@/data/static.home";
import HomeSectionHeader from "./HomeSectionHeader";

const HomeHowItWorksSection = () => {
  return (
    <section aria-labelledby="home-steps-title" className="bg-white">
      <div className="inner-wrapper space-y-6">
        <HomeSectionHeader
          id="home-steps-title"
          eyebrow="How It Works"
          title="Simple purchase flow from account setup to delivery updates"
          description="A clean customer journey with secure login and dashboard-based order tracking."
        />

        <ol className="grid gap-4 md:grid-cols-3">
          {homeHowItWorks.map((step, index) => (
            <li key={step.id} className="rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm">
              <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                {index + 1}
              </p>
              <h3 className="mt-3 text-base font-black text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-primary/80">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HomeHowItWorksSection;
