import Image from "next/image";

import { aboutTeam } from "@/data/static.about";
import AboutSectionHeader from "./AboutSectionHeader";

const AboutTeamSection = () => {
  return (
    <section aria-labelledby="about-team-title" className="bg-white">
      <div className="inner-wrapper space-y-6">
        <AboutSectionHeader
          id="about-team-title"
          eyebrow="Our Team"
          title="People behind the operations and customer experience"
          description="A cross-functional team focused on supply reliability, quality control, and customer support."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {aboutTeam.map((member) => (
            <article key={member.id} className="overflow-hidden rounded-2xl border border-secondary/20 bg-white shadow-sm">
              <Image
                src={member.image}
                alt={`${member.name}, ${member.role} at Grains Gold`}
                width={800}
                height={900}
                className="h-64 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-black text-primary">{member.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">{member.role}</p>
                <p className="mt-2 text-sm text-primary/80">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeamSection;

