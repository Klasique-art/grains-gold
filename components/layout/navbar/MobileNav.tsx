"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { NavLinkItem, ProfileMenuItem, AppUser } from "@/types";
import { getUserDisplayName, getUserInitials } from "@/utils";
import { BellIcon, CloseIcon, ContrastIcon, DashboardIcon, LogoutIcon, SavedIcon, SettingsIcon } from "./NavIcons";

interface MobileNavProps {
  open: boolean;
  navLinks: NavLinkItem[];
  profileLinks: ProfileMenuItem[];
  user: AppUser | null;
  isHighContrast: boolean;
  onToggleContrast: () => void;
  onClose: () => void;
  onLogout: () => void;
}

const menuIconMap = {
  dashboard: DashboardIcon,
  saved: SavedIcon,
  notifications: BellIcon,
  settings: SettingsIcon,
  logout: LogoutIcon,
};

const getRevealStyle = (index: number, open: boolean) => ({
  transitionDelay: open ? `${180 + index * 60}ms` : "0ms",
});

const MobileNav = ({
  open,
  navLinks,
  profileLinks,
  user,
  isHighContrast,
  onToggleContrast,
  onClose,
  onLogout,
}: MobileNavProps) => {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const body = document.body;
    body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key !== "Tab" || !menuRef.current) {
        return;
      }

      const focusables = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-navigation"
      className={`fixed inset-0 z-[70] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div className="absolute inset-0 grid grid-cols-2">
        <div
          className={`transition-transform duration-500 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          } motion-reduce:transition-none motion-reduce:transform-none relative overflow-hidden ${
            isHighContrast ? "bg-white border-r-2 border-black" : "bg-primary"
          }`}
        >
          {!isHighContrast ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.16) 0, transparent 34%), repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 8px)",
              }}
            />
          ) : null}
        </div>
        <div
          className={`transition-transform duration-500 ease-in-out ${
            open ? "translate-x-0" : "translate-x-full"
          } motion-reduce:transition-none motion-reduce:transform-none relative overflow-hidden ${
            isHighContrast ? "bg-white border-l-2 border-black" : "bg-secondary"
          }`}
        >
          {!isHighContrast ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 25%, rgba(255,255,255,0.18) 0, transparent 36%), repeating-linear-gradient(45deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 9px)",
              }}
            />
          ) : null}
        </div>
      </div>

      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`relative h-full transition-all duration-300 motion-reduce:transition-none ${
          open ? "opacity-100 delay-150" : "opacity-0"
        }`}
      >
        <div className="mx-auto flex h-[100dvh] max-w-[640px] flex-col px-5 pb-4 pt-5">
          <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
            <p className={`text-lg font-bold ${isHighContrast ? "text-black" : "text-white"}`}>Menu</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleContrast}
                aria-label={isHighContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
                aria-pressed={isHighContrast}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isHighContrast
                    ? "border-black bg-white text-black focus-visible:outline-black"
                    : "border-accent-2 text-white focus-visible:outline-accent-2"
                }`}
              >
                <ContrastIcon className="h-4 w-4" />
                <span>Contrast</span>
              </button>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close mobile menu"
                className={`rounded-full border p-2 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isHighContrast
                    ? "border-black text-black focus-visible:outline-black"
                    : "border-accent-2 text-white focus-visible:outline-accent-2"
                }`}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
            {user ? (
              <div
                style={getRevealStyle(0, open)}
                className={`mb-6 rounded-2xl border p-4 ${
                  isHighContrast ? "border-black bg-white text-black" : "border-accent/50 bg-white text-primary"
                } transition-all duration-500 motion-reduce:transition-none ${
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                } motion-reduce:transform-none`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                      isHighContrast ? "bg-black text-white" : "bg-primary text-white"
                    }`}
                    aria-hidden="true"
                  >
                    {getUserInitials(user)}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{getUserDisplayName(user)}</p>
                    <p className="text-xs opacity-80">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <nav aria-label="Mobile primary navigation" className="space-y-2">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    style={getRevealStyle(index + 1, open)}
                    className={`block rounded-xl border px-4 py-3 text-base font-semibold transition-all duration-500 motion-reduce:transition-none ${
                      open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    } motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isHighContrast
                        ? isActive
                          ? "border-black bg-black text-white focus-visible:outline-black"
                          : "border-black text-black hover:bg-black hover:text-white focus-visible:outline-black"
                        : isActive
                        ? "border-accent-2 bg-accent-2 text-primary focus-visible:outline-accent-2"
                        : "border-white/40 text-white hover:bg-white/20 focus-visible:outline-accent-2"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6">
              {user ? (
                <ul className="space-y-2" aria-label="Mobile profile menu">
                  {profileLinks.map((item, index) => {
                    const Icon = menuIconMap[item.icon];
                    if (item.isLogout) {
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onLogout();
                            }}
                            style={getRevealStyle(index + 8, open)}
                            className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-500 motion-reduce:transition-none ${
                              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                            } motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 ${
                              isHighContrast
                                ? "border-black text-black hover:bg-black hover:text-white focus-visible:outline-black"
                                : "border-accent-2/70 bg-white/95 text-primary hover:bg-accent/20 focus-visible:outline-accent-2"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </button>
                        </li>
                      );
                    }

                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href || "#"}
                          onClick={onClose}
                          style={getRevealStyle(index + 8, open)}
                          className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-500 motion-reduce:transition-none ${
                            open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                          } motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            isHighContrast
                              ? "border-black text-black hover:bg-black hover:text-white focus-visible:outline-black"
                              : "border-accent-2/70 bg-white/95 text-primary hover:bg-accent/20 focus-visible:outline-accent-2"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <Link
                    href="/login"
                    onClick={onClose}
                    style={getRevealStyle(8, open)}
                    className={`rounded-xl border px-4 py-3 text-center text-sm font-bold transition-all duration-500 motion-reduce:transition-none ${
                      open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    } motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isHighContrast
                        ? "border-black bg-white text-black hover:bg-black hover:text-white focus-visible:outline-black"
                        : "border-accent-2 bg-white text-primary hover:bg-accent/20 focus-visible:outline-accent-2"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    style={getRevealStyle(9, open)}
                    className={`rounded-xl px-4 py-3 text-center text-sm font-bold transition-all duration-500 motion-reduce:transition-none ${
                      open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    } motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isHighContrast
                        ? "bg-black text-white hover:bg-white hover:text-black border border-black focus-visible:outline-black"
                        : "bg-accent-2 text-primary hover:bg-accent border border-accent-2 focus-visible:outline-accent-2"
                    }`}
                  >
                    Create Customer Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
