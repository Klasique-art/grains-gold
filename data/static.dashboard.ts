import { DashboardNavItem } from "@/types";

export const dashboardNavLinks: DashboardNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/dashboard",
    description: "Quick view of your customer account activity.",
  },
  {
    id: "place-order",
    label: "Place Order",
    href: "/dashboard/place-order",
    description: "Create a new maize order from your dashboard.",
  },
  {
    id: "order-history",
    label: "Order History",
    href: "/dashboard/orders",
    description: "Review previous and current order records.",
  },
  {
    id: "order-status",
    label: "Order Status",
    href: "/dashboard/order-status",
    description: "Track real-time fulfillment and delivery state.",
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/dashboard/notifications",
    description: "See updates, alerts, and account notices.",
  },
  {
    id: "profile",
    label: "Profile Settings",
    href: "/dashboard/profile",
    description: "Manage your account and contact information.",
  },
];
