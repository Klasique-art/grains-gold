import Image from "next/image";

const AboutHeroSection = () => {
  return (
    <section aria-labelledby="about-hero-title" className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(circle_at_85%_20%,rgba(120,165,15,0.25),transparent_45%),radial-gradient(circle_at_20%_10%,rgba(249,199,15,0.15),transparent_40%)]"
      />
      <div className="inner-wrapper relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-secondary">
            About Grains Gold
          </p>
          <h1 id="about-hero-title" className="mt-4 text-3xl font-black leading-tight text-primary sm:text-5xl">
            Building trusted grain supply through quality, transparency, and consistent service.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-primary/85 sm:text-base">
            Grains Gold exists to connect customers with reliable maize supply while supporting farming communities.
            Our approach combines transparent pricing, careful quality control, and customer-focused fulfillment.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-white p-2 shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1629285483773-6b5cde2171d6?q=80&w=1200&auto=format&fit=crop"
            alt="Workers inspecting harvested maize for sorting and quality control"
            width={1200}
            height={900}
            className="h-[330px] w-full rounded-2xl object-cover sm:h-[430px]"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;

