export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

export type MenuIconName =
  | "dashboard"
  | "saved"
  | "notifications"
  | "settings"
  | "logout";

export interface ProfileMenuItem {
  id: string;
  label: string;
  href?: string;
  icon: MenuIconName;
  isLogout?: boolean;
}

