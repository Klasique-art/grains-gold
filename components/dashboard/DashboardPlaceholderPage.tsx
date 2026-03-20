import Link from "next/link";

type DashboardPlaceholderPageProps = {
  title: string;
  description: string;
};

const tiles = [
  { label: "Status", value: "Coming soon" },
  { label: "Last update", value: "In setup" },
  { label: "Experience", value: "Dashboard shell ready" },
];

const DashboardPlaceholderPage = ({ title, description }: DashboardPlaceholderPageProps) => {
  return (
    <section className="dash-page" aria-labelledby="dash-page-title">
      <header className="mb-7">
        <p className="inline-flex items-center rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary">
          Customer Dashboard
        </p>
        <h1 id="dash-page-title" className="mt-3 text-2xl font-black text-primary sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-primary/80 sm:text-base">{description}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {tiles.map((tile) => (
          <article
            key={tile.label}
            className="rounded-xl border border-secondary/25 bg-white px-4 py-4 shadow-[0_18px_40px_-36px_rgba(29,92,33,0.6)]"
            aria-label={`${tile.label} ${tile.value}`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">{tile.label}</p>
            <p className="mt-2 text-sm font-semibold text-primary">{tile.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-secondary/25 bg-white p-5">
        <p className="text-sm text-primary/80">
          This page is intentionally scaffolded as an empty module for now. Functional widgets and API integration can
          be dropped in without changing page structure.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
        >
          Back to Overview
        </Link>
      </div>
    </section>
  );
};

export default DashboardPlaceholderPage;
