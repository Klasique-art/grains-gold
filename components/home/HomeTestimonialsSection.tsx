import { homeTestimonials } from "@/data/static.home";
import HomeSectionHeader from "./HomeSectionHeader";

const HomeTestimonialsSection = () => {
  return (
    <section aria-labelledby="home-testimonials-title" className="bg-linear-to-b from-secondary/5 to-white">
      <div className="inner-wrapper space-y-6">
        <HomeSectionHeader
          id="home-testimonials-title"
          eyebrow="Customer Voices"
          title="What buyers say after ordering with Grains Gold"
          description="Real outcomes from recurring customers across retail, poultry, and food processing."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {homeTestimonials.map((testimonial) => (
            <figure key={testimonial.id} className="rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm">
              <blockquote className="text-sm leading-relaxed text-primary/85">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-4 border-t border-secondary/15 pt-3">
                <p className="text-sm font-black text-primary">{testimonial.customerName}</p>
                <p className="text-xs text-primary/70">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonialsSection;
