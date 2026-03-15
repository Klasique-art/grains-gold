import { aboutMilestones } from "@/data/static.about";
import AboutSectionHeader from "./AboutSectionHeader";

const AboutMilestonesSection = () => {
  return (
    <section aria-labelledby="about-milestones-title" className="bg-white">
      <div className="inner-wrapper space-y-6">
        <AboutSectionHeader
          id="about-milestones-title"
          eyebrow="Milestones"
          title="How our operations have evolved over time"
          description="A quick timeline of the major moments that shaped Grains Gold."
        />

        <ol className="grid gap-4 md:grid-cols-2">
          {aboutMilestones.map((milestone) => (
            <li key={milestone.id} className="rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">{milestone.year}</p>
              <h3 className="mt-2 text-lg font-black text-primary">{milestone.title}</h3>
              <p className="mt-2 text-sm text-primary/80">{milestone.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default AboutMilestonesSection;

