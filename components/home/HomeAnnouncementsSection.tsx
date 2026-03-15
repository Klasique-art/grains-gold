import Link from "next/link";

import { homeAnnouncements } from "@/data/static.home";
import HomeSectionHeader from "./HomeSectionHeader";

const HomeAnnouncementsSection = () => {
  return (
    <section aria-labelledby="home-announcements-title" className="bg-white">
      <div className="inner-wrapper space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <HomeSectionHeader
            id="home-announcements-title"
            eyebrow="Latest Announcements"
            title="Fresh updates, logistics changes, and stock news"
            description="Preview the latest updates before heading into your customer dashboard."
          />
          <Link
            href="/announcements"
            className="rounded-xl border border-secondary/40 bg-white px-4 py-2 text-sm font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            View All Updates
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {homeAnnouncements.map((announcement) => (
            <article key={announcement.id} className="rounded-2xl border border-secondary/20 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">{announcement.publishedAt}</p>
              <h3 className="mt-2 text-lg font-black text-primary">{announcement.title}</h3>
              <p className="mt-2 text-sm text-primary/80">{announcement.excerpt}</p>
              <Link
                href={announcement.href}
                className="mt-4 inline-flex text-sm font-bold text-primary underline decoration-accent-2/80 underline-offset-4 transition hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                Read update
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAnnouncementsSection;
