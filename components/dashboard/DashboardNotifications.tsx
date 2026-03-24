"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { parseApiError } from "@/app/lib/authClient";
import { AnnouncementPreviewItem, fetchAnnouncementsPreview } from "@/app/lib/dashboardClient";
import { OrderItem, getMyOrderHistory } from "@/app/lib/ordersClient";
import { fetchNotificationPreferences } from "@/app/lib/profileClient";

type NotificationFeedItem = {
  id: string;
  type: "order" | "announcement" | "delivery";
  title: string;
  body: string;
  at: string;
};

const statusLabel: Record<OrderItem["order_status"], string> = {
  PENDING: "pending review",
  PROCESSING: "processing",
  DISPATCHED: "dispatched",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const asDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const dateTimeLabel = (value: string) => {
  const date = asDate(value);
  if (!date) return "Unknown time";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const dateLabel = (value: string) => {
  const date = asDate(value);
  if (!date) return "Unknown date";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toOrderNotification = (order: OrderItem): NotificationFeedItem => ({
  id: `order-${order.id}`,
  type: "order",
  title: `Order ${order.order_id} is ${statusLabel[order.order_status]}`,
  body: `${order.product_details?.name || `Product #${order.product}`} - ${order.quantity_bags} bag(s) - GHS ${Number(order.total_price).toLocaleString("en-GH")}`,
  at: order.updated_at || order.created_at,
});

const toDeliveryNotification = (order: OrderItem): NotificationFeedItem => ({
  id: `delivery-${order.id}`,
  type: "delivery",
  title: `Delivery scheduled for ${order.order_id}`,
  body: `Expected on ${dateLabel(order.delivery_date)} via ${order.delivery_method === "DELIVERY" ? "delivery" : "pickup"}.`,
  at: order.delivery_date,
});

const toAnnouncementNotification = (announcement: AnnouncementPreviewItem): NotificationFeedItem => ({
  id: `announcement-${announcement.id}`,
  type: "announcement",
  title: announcement.title,
  body: announcement.excerpt,
  at: announcement.published_at,
});

const tagClass: Record<NotificationFeedItem["type"], string> = {
  order: "border-secondary/30 bg-secondary/10 text-primary",
  delivery: "border-accent-2/45 bg-accent-2/20 text-primary",
  announcement: "border-primary/25 bg-primary/10 text-primary",
};

const DashboardNotifications = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementPreviewItem[]>([]);
  const [preferencesSummary, setPreferencesSummary] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [orderData, announcementData, preferencesData] = await Promise.all([
          getMyOrderHistory(),
          fetchAnnouncementsPreview(10),
          fetchNotificationPreferences(),
        ]);

        if (!mounted) return;

        setOrders(orderData);
        setAnnouncements(announcementData);

        const enabled = [
          preferencesData.order_updates ? "Order updates" : null,
          preferencesData.price_alerts ? "Price alerts" : null,
          preferencesData.announcements ? "Announcements" : null,
          preferencesData.whatsapp_notifications ? "WhatsApp alerts" : null,
        ].filter((item): item is string => Boolean(item));

        setPreferencesSummary(enabled);
      } catch (error) {
        if (!mounted) return;
        const parsed = parseApiError(error, "Unable to load notifications.");
        setErrorMessage(parsed.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const feed = useMemo(() => {
    const orderNotifications = orders.map(toOrderNotification);

    const deliveryNotifications = orders
      .filter((order) => order.order_status !== "CANCELLED" && order.order_status !== "DELIVERED")
      .slice(0, 8)
      .map(toDeliveryNotification);

    const announcementNotifications = announcements.map(toAnnouncementNotification);

    return [...orderNotifications, ...deliveryNotifications, ...announcementNotifications]
      .filter((item) => Boolean(asDate(item.at)?.getTime()))
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 20);
  }, [announcements, orders]);

  if (loading) {
    return (
      <section className="dash-page" aria-labelledby="dashboard-notifications-title">
        <div className="rounded-2xl border border-secondary/25 bg-white p-5 text-sm text-primary/80">Loading notifications...</div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="dash-page" aria-labelledby="dashboard-notifications-title">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-700">{errorMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dash-page" aria-labelledby="dashboard-notifications-title">
      <header className="mb-6">
        <p className="inline-flex rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-secondary">
          Customer Notifications
        </p>
        <h1 id="dashboard-notifications-title" className="mt-3 text-2xl font-black text-primary sm:text-3xl">
          Notifications and Updates
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-primary/80">Real-time feed generated from your backend orders and announcements data.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-secondary/25 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-primary">Latest Activity</h2>
            <span className="rounded-full border border-secondary/30 bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
              {feed.length} items
            </span>
          </div>

          {feed.length > 0 ? (
            <ul className="space-y-3" aria-label="Notifications feed">
              {feed.map((item) => (
                <li key={item.id} className="rounded-xl border border-secondary/20 bg-white p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-black text-primary">{item.title}</p>
                    <span className={`rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${tagClass[item.type]}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-primary/85">{item.body}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-secondary">{dateTimeLabel(item.at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-secondary/20 bg-white p-3 text-sm text-primary/75">No notifications yet.</p>
          )}
        </article>

        <aside className="grid gap-4">
          <article className="rounded-2xl border border-secondary/25 bg-white p-5">
            <h2 className="text-lg font-black text-primary">Notification Channels</h2>
            <p className="mt-1 text-sm text-primary/75">Enabled channels from your profile settings:</p>
            {preferencesSummary.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {preferencesSummary.map((item) => (
                  <li key={item} className="rounded-lg border border-secondary/20 bg-white px-3 py-2 text-sm font-semibold text-primary">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-lg border border-secondary/20 bg-white px-3 py-2 text-sm text-primary/75">All channels currently disabled.</p>
            )}
            <Link
              href="/dashboard/profile"
              className="mt-4 inline-flex rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              Manage preferences
            </Link>
          </article>

          <article className="rounded-2xl border border-secondary/25 bg-white p-5">
            <h2 className="text-lg font-black text-primary">Quick Links</h2>
            <div className="mt-3 grid gap-2">
              <Link
                href="/dashboard/orders"
                className="rounded-lg border border-secondary/35 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                View order history
              </Link>
              <Link
                href="/dashboard/order-status"
                className="rounded-lg border border-secondary/35 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                Track active orders
              </Link>
              <Link
                href="/products"
                className="rounded-lg border border-secondary/35 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                Browse products
              </Link>
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
};

export default DashboardNotifications;
