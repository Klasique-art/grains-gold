"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BellRing, Boxes, ClipboardList, ShoppingCart, Truck, UserCog } from "lucide-react";

import { dashboardNavLinks } from "@/data/static.dashboard";

type DashboardSidebarProps = {
  isHighContrast?: boolean;
  onNavigate?: () => void;
};

const iconById = {
  overview: LayoutDashboard,
  products: Boxes,
  "place-order": ShoppingCart,
  "order-history": ClipboardList,
  "order-status": Truck,
  notifications: BellRing,
  profile: UserCog,
};

const DashboardSidebar = ({ isHighContrast = false, onNavigate }: DashboardSidebarProps) => {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="space-y-2">
      {dashboardNavLinks.map((item) => {
        const Icon = iconById[item.id as keyof typeof iconById] ?? LayoutDashboard;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`group flex items-start gap-3 rounded-xl border px-3 py-3 transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isActive
                ? isHighContrast
                  ? "border-black bg-black !text-white focus-visible:outline-black"
                  : "border-accent-2 bg-accent-2/22 !text-white focus-visible:outline-accent-2"
                : isHighContrast
                ? "border-black/35 bg-white text-black hover:border-black hover:bg-black hover:text-white focus-visible:outline-black"
                : "border-secondary/30 bg-white/5 text-white hover:border-accent-2/60 hover:bg-white/15 focus-visible:outline-accent-2"
            }`}
          >
            <span
              className={`mt-0.5 rounded-lg border p-1.5 ${
                isActive
                  ? isHighContrast
                    ? "border-white/35 bg-white/10 !text-white"
                    : "border-white/35 bg-white/10 !text-white"
                  : isHighContrast
                  ? "border-black/25 bg-white text-black group-hover:border-white/40 group-hover:bg-white/10 group-hover:text-white"
                  : "border-white/30 bg-white/10 text-white"
              }`}
              aria-hidden="true"
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span
                className={`block text-sm font-bold ${
                  isActive
                    ? isHighContrast
                      ? "!text-white"
                      : "!text-white"
                    : isHighContrast
                    ? "text-black group-hover:text-white"
                    : "text-white"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block text-xs ${
                  isActive
                    ? isHighContrast
                      ? "!text-white/85"
                      : "!text-white/85"
                    : isHighContrast
                    ? "text-black/80 group-hover:text-white/80"
                    : "text-white/80"
                }`}
              >
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DashboardSidebar;
