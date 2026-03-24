"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ContrastIcon } from "@/components/layout/navbar/NavIcons";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ConfirmModal } from "@/components";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getCurrentUser, logout } from "@/app/lib/authClient";
import { dashboardNavLinks } from "@/data/static.dashboard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [signoutModalOpen, setSignoutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem("high-contrast-enabled") === "true";
  });

  const activeItem = useMemo(
    () => dashboardNavLinks.find((item) => item.href === pathname) ?? dashboardNavLinks[0],
    [pathname],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", isHighContrast);
    window.localStorage.setItem("high-contrast-enabled", String(isHighContrast));
  }, [isHighContrast]);

  useEffect(() => {
    let mounted = true;

    const ensureAuthenticated = async () => {
      try {
        await getCurrentUser();
        if (!mounted) return;
        setAuthReady(true);
      } catch {
        if (!mounted) return;
        router.replace("/auth?mode=login");
      }
    };

    void ensureAuthenticated();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileSidebarOpen]);

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-center text-sm font-semibold text-primary">Checking your session...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isHighContrast
          ? "bg-white"
          : "bg-[radial-gradient(circle_at_10%_10%,rgba(205,220,57,0.26),transparent_38%),radial-gradient(circle_at_88%_14%,rgba(120,165,15,0.18),transparent_42%),linear-gradient(145deg,#f8fcf2_0%,#ffffff_48%,#f6faee_100%)]"
      }`}
    >
      <a
        href="#dashboard-main-content"
        className="sr-only z-[90] rounded-md bg-accent-2 px-4 py-2 text-sm font-bold text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to dashboard content
      </a>

      <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 gap-4 px-2 pb-4 pt-3 sm:px-4 lg:grid-cols-[320px_1fr]">
        <aside
          className={`hidden rounded-3xl border p-3 shadow-[0_32px_60px_-44px_rgba(29,92,33,0.65)] lg:sticky lg:top-3 lg:flex lg:h-[calc(100vh-1.5rem)] lg:self-start lg:flex-col ${
            isHighContrast
              ? "border-black bg-white"
              : "border-secondary/25 bg-gradient-to-b from-primary via-primary to-secondary text-white"
          }`}
        >
          <div className="mb-5 rounded-2xl border border-white/25 bg-white/10 px-4 py-4">
            <p className={`text-xs font-bold uppercase tracking-wide ${isHighContrast ? "text-black" : "text-white/85"}`}>
              Grains Gold
            </p>
            <h1 className={`mt-1 text-xl font-black ${isHighContrast ? "text-black" : "text-white"}`}>Customer Dashboard</h1>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <DashboardSidebar isHighContrast={isHighContrast} />
          </div>

          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={() => setSignoutModalOpen(true)}
              aria-label="Sign out"
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isHighContrast
                  ? "border-black bg-black text-white hover:bg-white hover:text-black focus-visible:outline-black"
                  : "border-accent-2 bg-accent-2 text-primary hover:bg-accent focus-visible:outline-accent-2"
              }`}
            >
              <span>Sign out</span>
            </button>
            <Link
              href="/"
              className={`rounded-xl border px-4 py-2 text-center text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isHighContrast
                  ? "border-black text-black hover:bg-black hover:text-white focus-visible:outline-black"
                  : "border-white/50 text-white hover:bg-white/15 focus-visible:outline-accent-2"
              }`}
            >
              Back to Home
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          <header
            className={`mb-4 flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 backdrop-blur sm:px-4 ${
              isHighContrast ? "border-black bg-white" : "border-secondary/25 bg-white/80"
            }`}
          >
            <div className="min-w-0">
              <p className={`truncate text-xs font-bold uppercase tracking-wide ${isHighContrast ? "text-black" : "text-secondary"}`}>
                Dashboard
              </p>
              <h2 className={`truncate text-lg font-black sm:text-xl ${isHighContrast ? "text-black" : "text-primary"}`}>
                {activeItem.label}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHighContrast((state) => !state)}
                aria-label={isHighContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
                aria-pressed={isHighContrast}
                className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isHighContrast
                    ? "border-black bg-white text-black focus-visible:outline-black"
                    : "border-secondary/35 bg-white text-primary hover:bg-accent/20 focus-visible:outline-accent-2"
                }`}
              >
                <ContrastIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Contrast</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open dashboard menu"
                aria-controls="dashboard-mobile-menu"
                aria-expanded={mobileSidebarOpen}
                className={`rounded-lg border p-2 transition lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isHighContrast
                    ? "border-black bg-white text-black focus-visible:outline-black"
                    : "border-secondary/35 bg-white text-primary focus-visible:outline-accent-2"
                }`}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </header>

          <main id="dashboard-main-content" aria-live="polite" className="min-w-0">
            {children}
          </main>
        </div>
      </div>

      <div
        id="dashboard-mobile-menu"
        className={`fixed inset-0 z-[90] lg:hidden ${mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileSidebarOpen}
      >
        <button
          type="button"
          aria-label="Close dashboard menu overlay"
          onClick={() => setMobileSidebarOpen(false)}
          className={`absolute inset-0 transition-opacity ${mobileSidebarOpen ? "opacity-100" : "opacity-0"} bg-black/45`}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard navigation menu"
          className={`absolute inset-y-0 left-0 flex h-full w-[88vw] max-w-[340px] transform flex-col border-r p-3 transition-transform ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            isHighContrast
              ? "border-black bg-white"
              : "border-secondary/30 bg-gradient-to-b from-primary via-primary to-secondary text-white"
          }`}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className={`text-xs font-bold uppercase tracking-wide ${isHighContrast ? "text-black" : "text-white/85"}`}>
                Grains Gold
              </p>
              <p className={`text-base font-black ${isHighContrast ? "text-black" : "text-white"}`}>Dashboard Menu</p>
            </div>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close dashboard menu"
              className={`rounded-full border p-2 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isHighContrast
                  ? "border-black text-black focus-visible:outline-black"
                  : "border-accent-2 text-white focus-visible:outline-accent-2"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <DashboardSidebar isHighContrast={isHighContrast} onNavigate={() => setMobileSidebarOpen(false)} />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setMobileSidebarOpen(false);
                setSignoutModalOpen(true);
              }}
              className={`w-full rounded-xl border px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isHighContrast
                  ? "border-black bg-white text-black hover:bg-black hover:text-white focus-visible:outline-black"
                  : "border-accent-2 bg-accent-2 text-primary hover:bg-accent focus-visible:outline-accent-2"
              }`}
            >
              Sign out
            </button>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={signoutModalOpen}
        isHighContrast={isHighContrast}
        title="Sign out of dashboard?"
        description="You will be returned to the authentication page. You can sign in again at any time."
        confirmLabel={isSigningOut ? "Signing out..." : "Yes, sign out"}
        cancelLabel="Stay signed in"
        onClose={() => setSignoutModalOpen(false)}
        onConfirm={async () => {
          if (isSigningOut) return;

          setIsSigningOut(true);
          try {
            await logout();
          } finally {
            setSignoutModalOpen(false);
            setIsSigningOut(false);
            router.push("/auth?mode=login");
          }
        }}
      />
    </div>
  );
};

export default DashboardLayout;
