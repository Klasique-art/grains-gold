"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getCurrentUser, getTokens } from "@/app/lib/authClient";
import { homeHeroStats } from "@/data/static.home";

const HomeHeroSection = () => {
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
    <section aria-labelledby="home-hero-title" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_right,rgba(120,165,15,0.32),transparent_50%),radial-gradient(circle_at_20%_30%,rgba(249,199,15,0.18),transparent_45%)]"
      />

      <div className="inner-wrapper relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-secondary">
            Trusted maize supply for every scale
          </p>
          <h1 id="home-hero-title" className="mt-4 text-3xl font-black leading-tight text-primary sm:text-5xl">
            Buy quality maize with clear pricing, reliable availability, and faster fulfillment.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-primary/85 sm:text-base">
            Grains Gold helps households, retailers, and processors access clean maize at transparent rates per bag and per ton.
            Create an account to place orders, track status, and receive fresh stock updates.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="rounded-xl border border-primary bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/register"
                className="rounded-xl border border-primary bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                Create Customer Account
              </Link>
            )}
            <Link
              href="/products"
              className="rounded-xl border border-secondary/40 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              View Products
            </Link>
            <Link
              href="/contact#quote"
              className="rounded-xl border border-accent-2 bg-accent-2 px-5 py-3 text-sm font-bold text-primary transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              Request a Quote
            </Link>
          </div>

          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {homeHeroStats.map((stat) => (
              <div key={stat.id} className="rounded-2xl border border-secondary/20 bg-white/90 px-4 py-3">
                <dt className="text-xs text-primary/70">{stat.label}</dt>
                <dd className="text-lg font-black text-primary">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-white p-2 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1200&auto=format&fit=crop"
              alt="Harvested maize cobs arranged in rows for quality sorting"
              width={1200}
              height={900}
              priority
              className="h-[320px] w-full rounded-2xl object-cover sm:h-[420px]"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-2xl border border-secondary/25 bg-white px-4 py-3 shadow-lg">
            <p className="text-xs font-semibold text-primary/70">Public price visibility</p>
            <p className="text-sm font-black text-primary">Bag + Ton pricing available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
