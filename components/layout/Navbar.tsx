"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { profileMenuItems, publicNavLinks } from "@/data/static.navbar";
import { AppUser } from "@/types";
import { getUserDisplayName } from "@/utils";
import { ContrastIcon, MenuIcon } from "./navbar/NavIcons";
import MobileNav from "./navbar/MobileNav";
import ProfileDropdown from "./navbar/ProfileDropdown";

interface NavbarProps {
  currentUser?: AppUser | null;
}

const Navbar = ({ currentUser = null }: NavbarProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("high-contrast-enabled") === "true";
  });

  const isAuthenticated = Boolean(currentUser?.is_active);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", isHighContrast);
    window.localStorage.setItem("high-contrast-enabled", String(isHighContrast));
  }, [isHighContrast]);

  const toggleContrast = () => {
    setIsHighContrast((prevState) => !prevState);
  };

  const handleLogout = () => {
    console.info("User requested logout");
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[90] rounded-md bg-accent-2 px-4 py-2 text-sm font-bold text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-[60] border-b backdrop-blur ${
          isHighContrast
            ? "border-black bg-white text-black"
            : "border-secondary/20 bg-white/95 text-primary"
        }`}
      >
        <div className="inner-wrapper px-2 xs:px-4">
          <div className="flex h-18 items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                aria-label="Grains Gold home page"
                className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                <span className="block text-base font-black tracking-wide sm:text-lg">Grains Gold</span>
                <span className={`block text-[11px] ${isHighContrast ? "text-black" : "text-secondary"}`}>
                  Premium maize marketplace
                </span>
              </Link>

              <nav className="hidden lg:block" aria-label="Primary navigation">
                <ul className="flex items-center gap-1">
                  {publicNavLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.id}>
                        <Link
                          href={link.href}
                          aria-current={isActive ? "page" : undefined}
                          className={`rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            isHighContrast
                              ? isActive
                                ? "bg-black text-white focus-visible:outline-black"
                                : "text-black hover:bg-black hover:text-white focus-visible:outline-black"
                              : isActive
                              ? "bg-primary text-white focus-visible:outline-accent-2"
                              : "text-primary hover:bg-accent/20 focus-visible:outline-accent-2"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={toggleContrast}
                aria-label={isHighContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
                aria-pressed={isHighContrast}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isHighContrast
                    ? "border-black bg-white text-black focus-visible:outline-black"
                    : "border-secondary/30 bg-white text-primary hover:bg-accent/20 focus-visible:outline-accent-2"
                }`}
              >
                <ContrastIcon className="h-4 w-4" />
                <span>Contrast</span>
              </button>

              {isAuthenticated && currentUser ? (
                <ProfileDropdown
                  open={profileOpen}
                  user={currentUser}
                  menuItems={profileMenuItems}
                  onToggle={() => setProfileOpen((prev) => !prev)}
                  onClose={() => setProfileOpen(false)}
                  onLogout={handleLogout}
                  isHighContrast={isHighContrast}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth?mode=login"
                    className={`rounded-lg border px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isHighContrast
                        ? "border-black text-black hover:bg-black hover:text-white focus-visible:outline-black"
                        : "border-secondary/40 text-primary hover:bg-accent/20 focus-visible:outline-accent-2"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className={`rounded-lg px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isHighContrast
                        ? "border border-black bg-black text-white hover:bg-white hover:text-black focus-visible:outline-black"
                        : "border border-accent-2 bg-accent-2 text-primary hover:bg-accent focus-visible:outline-accent-2"
                    }`}
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              {isAuthenticated && currentUser ? (
                <span className={`max-w-[140px] truncate text-xs font-semibold ${isHighContrast ? "text-black" : "text-primary"}`}>
                  {getUserDisplayName(currentUser)}
                </span>
              ) : null}
              <button
                type="button"
                onClick={toggleContrast}
                aria-label={isHighContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
                aria-pressed={isHighContrast}
                className={`rounded-lg border p-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isHighContrast
                    ? "border-black bg-white text-black focus-visible:outline-black"
                    : "border-secondary/40 bg-white text-primary focus-visible:outline-accent-2"
                }`}
              >
                <ContrastIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open mobile menu"
                aria-controls="mobile-navigation"
                aria-expanded={mobileOpen}
                className={`rounded-lg border p-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isHighContrast
                    ? "border-black bg-white text-black focus-visible:outline-black"
                    : "border-secondary/40 bg-white text-primary focus-visible:outline-accent-2"
                }`}
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        navLinks={publicNavLinks}
        profileLinks={profileMenuItems}
        user={isAuthenticated ? currentUser : null}
        isHighContrast={isHighContrast}
        onToggleContrast={toggleContrast}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
