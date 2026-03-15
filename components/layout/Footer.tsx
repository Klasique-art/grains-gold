import Link from "next/link";

import { footerContactInfo, footerCustomerLinks, footerPrimaryLinks } from "@/data/static.footer";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-secondary/20 bg-primary text-white">
      <div className="inner-wrapper">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <section aria-labelledby="footer-brand">
            <h2 id="footer-brand" className="text-lg font-black tracking-wide">
              Grains Gold
            </h2>
            <p className="mt-3 text-sm text-white/85">
              Reliable maize supply for homes, retailers, and industrial buyers. Fresh stock, clear prices, and dependable delivery.
            </p>
            <p className="mt-4 text-xs text-accent-2">Customer-first grain marketplace.</p>
          </section>

          <nav aria-label="Footer primary links">
            <h2 className="text-sm font-bold uppercase tracking-wide text-accent-2">Explore</h2>
            <ul className="mt-4 space-y-2">
              {footerPrimaryLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="rounded-sm text-sm text-white/90 underline-offset-4 hover:text-accent-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer customer links">
            <h2 className="text-sm font-bold uppercase tracking-wide text-accent-2">Customers</h2>
            <ul className="mt-4 space-y-2">
              {footerCustomerLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="rounded-sm text-sm text-white/90 underline-offset-4 hover:text-accent-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-contact">
            <h2 id="footer-contact" className="text-sm font-bold uppercase tracking-wide text-accent-2">
              Contact
            </h2>
            <ul className="mt-4 space-y-3">
              {footerContactInfo.map((item) => (
                <li key={item.id}>
                  <p className="text-xs font-semibold text-white/75">{item.label}</p>
                  <a
                    href={item.href}
                    target={item.id === "whatsapp" || item.id === "address" ? "_blank" : undefined}
                    rel={item.id === "whatsapp" || item.id === "address" ? "noreferrer noopener" : undefined}
                    className="rounded-sm text-sm text-white/95 underline-offset-4 hover:text-accent-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                    aria-label={`${item.label}: ${item.value}`}
                  >
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 border-t border-white/20 pt-5">
          <p className="text-center text-xs text-white/80">
            &copy; {year} Grains Gold. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
