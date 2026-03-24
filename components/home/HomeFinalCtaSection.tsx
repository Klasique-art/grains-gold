"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCurrentUser, getTokens } from "@/app/lib/authClient";

const HomeFinalCtaSection = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean(getTokens().access);
  });

  useEffect(() => {
    let mounted = true;

    const syncAuth = async () => {
      const { access } = getTokens();
      if (!access) {
        if (mounted) setIsAuthenticated(false);
        return;
      }

      try {
        await getCurrentUser();
        if (mounted) setIsAuthenticated(true);
      } catch {
        if (mounted) setIsAuthenticated(false);
      }
    };

    void syncAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section aria-labelledby="home-final-cta-title" className="bg-primary">
      <div className="inner-wrapper">
        <div className="rounded-3xl border border-white/20 bg-linear-to-r from-primary via-secondary to-primary p-6 sm:p-8">
          <h2 id="home-final-cta-title" className="text-2xl font-black text-white sm:text-3xl">
            Ready to secure your next maize supply?
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            {isAuthenticated
              ? "Open your dashboard to review live product availability and place orders with full status visibility."
              : "Create your customer account, review live product availability, and place orders with full status visibility."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="rounded-xl border border-white bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-accent-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/register"
                className="rounded-xl border border-white bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-accent-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                Create Customer Account
              </Link>
            )}
            <Link
              href="/contact#quote"
              className="rounded-xl border border-accent-2 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFinalCtaSection;
