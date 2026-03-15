import { NavLinkItem, ProfileMenuItem } from "@/types";

export const publicNavLinks: NavLinkItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "products", label: "Products", href: "/products" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export const profileMenuItems: ProfileMenuItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { id: "saved", label: "Saved Items", href: "/dashboard/saved-items", icon: "saved" },
  {
    id: "notifications",
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: "notifications",
  },
  { id: "settings", label: "Profile Settings", href: "/dashboard/profile", icon: "settings" },
  { id: "logout", label: "Logout", icon: "logout", isLogout: true },
];
