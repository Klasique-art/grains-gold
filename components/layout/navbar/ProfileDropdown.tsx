"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { ProfileMenuItem, AppUser } from "@/types";
import { getUserDisplayName, getUserInitials } from "@/utils";
import { BellIcon, DashboardIcon, LogoutIcon, SavedIcon, SettingsIcon } from "./NavIcons";

interface ProfileDropdownProps {
  open: boolean;
  user: AppUser;
  menuItems: ProfileMenuItem[];
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
  isHighContrast: boolean;
}

const iconMap = {
  dashboard: DashboardIcon,
  saved: SavedIcon,
  notifications: BellIcon,
  settings: SettingsIcon,
  logout: LogoutIcon,
};

const ProfileDropdown = ({
  open,
  user,
  menuItems,
  onToggle,
  onClose,
  onLogout,
  isHighContrast,
}: ProfileDropdownProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (open && rootRef.current && !rootRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onClose, open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "Escape") {
        onClose();
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const displayName = getUserDisplayName(user);
  const menuSurfaceClass = isHighContrast ? "bg-white border-black" : "bg-white border-secondary/30";
  const menuTextClass = isHighContrast ? "text-black" : "text-primary";

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={toggleRef}
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className={`flex items-center gap-2 rounded-full border px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isHighContrast
            ? "border-black bg-white text-black focus-visible:outline-black"
            : "border-secondary/50 bg-white text-primary focus-visible:outline-accent-2"
        }`}
      >
        {user.profile_picture ? (
          <Image
            src={user.profile_picture}
            width={36}
            height={36}
            alt={`${displayName} profile picture`}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
              isHighContrast ? "bg-black text-white" : "bg-primary text-white"
            }`}
            aria-hidden="true"
          >
            {getUserInitials(user)}
          </span>
        )}
        <span className="hidden text-sm font-semibold sm:inline">{displayName}</span>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="User profile menu"
          className={`absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border shadow-xl ${menuSurfaceClass}`}
        >
          <div className={`border-b px-4 py-3 ${isHighContrast ? "border-black bg-white" : "border-secondary/30 bg-accent/15"}`}>
            <p className={`text-sm font-bold ${menuTextClass}`}>{displayName}</p>
            <p className={`truncate text-xs ${isHighContrast ? "text-black" : "text-primary/80"}`}>{user.email}</p>
          </div>

          <ul className="py-2">
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon];
              const commonClass = `flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${
                isHighContrast
                  ? "text-black hover:bg-black hover:text-white focus-visible:outline-black"
                  : "text-primary hover:bg-accent/20 focus-visible:outline-accent-2"
              }`;

              if (item.isLogout) {
                return (
                  <li key={item.id}>
                    <button role="menuitem" type="button" onClick={onLogout} className={commonClass}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <Link href={item.href || "#"} role="menuitem" onClick={onClose} className={commonClass}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileDropdown;
