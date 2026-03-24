"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  AnnouncementPreviewItem,
  CustomerMeResponse,
  CustomerOrderHistoryItem,
  HeroMetricsResponse,
  fetchAnnouncementsPreview,
  fetchCustomerMe,
  fetchHeroMetrics,
  fetchOrdersHistory,
} from "@/app/lib/dashboardClient";

type OrderStatus = CustomerOrderHistoryItem["order_status"];

type SpendPoint = {
  label: string;
  value: number;
};

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }).format(Number(value));

const statusMeta: Record<OrderStatus, { label: string; colorClass: string; color: string }> = {
  PENDING: { label: "Pending", colorClass: "bg-accent-2/25 text-primary border-accent-2", color: "var(--color-accent-2)" },
  PROCESSING: { label: "Processing", colorClass: "bg-secondary/20 text-primary border-secondary", color: "var(--color-secondary)" },
  DISPATCHED: { label: "Dispatched", colorClass: "bg-primary/20 text-primary border-primary", color: "var(--color-primary)" },
  DELIVERED: { label: "Delivered", colorClass: "bg-primary/15 text-primary border-primary", color: "var(--color-primary)" },
  CANCELLED: { label: "Cancelled", colorClass: "bg-black/10 text-black border-black/30", color: "#6b7280" },
};

const monthLabel = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    month: "short",
  });

const buildSixMonthTrend = (orders: CustomerOrderHistoryItem[]): SpendPoint[] => {
  const now = new Date();
  const months: Date[] = [];

  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d);
  }

  const buckets = new Map<string, number>();
  months.forEach((m) => buckets.set(`${m.getFullYear()}-${m.getMonth()}`, 0));

  orders.forEach((order) => {
    const created = new Date(order.created_at);
    const key = `${created.getFullYear()}-${created.getMonth()}`;

    if (!buckets.has(key)) return;
    buckets.set(key, (buckets.get(key) ?? 0) + Number(order.total_price));
  });

  return months.map((m) => ({
    label: monthLabel(m),
    value: buckets.get(`${m.getFullYear()}-${m.getMonth()}`) ?? 0,
  }));
};

const DashboardOverview = () => {
  const [customerProfile, setCustomerProfile] = useState<CustomerMeResponse | null>(null);
  const [heroMetrics, setHeroMetrics] = useState<HeroMetricsResponse | null>(null);
  const [orders, setOrders] = useState<CustomerOrderHistoryItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementPreviewItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [customerData, heroData, orderData, announcementData] = await Promise.all([
          fetchCustomerMe(),
          fetchHeroMetrics(),
          fetchOrdersHistory(),
          fetchAnnouncementsPreview(3),
        ]);

        if (!mounted) return;

        setCustomerProfile(customerData);
        setHeroMetrics(heroData);
        setOrders(orderData);
        setAnnouncements(announcementData);
      } catch (error) {
        if (!mounted) return;

        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message: unknown }).message)
            : "Unable to load dashboard data.";

        setErrorMessage(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const spendTrend = useMemo(() => buildSixMonthTrend(orders), [orders]);

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4),
    [orders],
  );

  const statusTotals = useMemo(
    () =>
      orders.reduce<Record<OrderStatus, number>>(
        (acc, order) => {
          acc[order.order_status] += 1;
          return acc;
        },
        { PENDING: 0, PROCESSING: 0, DISPATCHED: 0, DELIVERED: 0, CANCELLED: 0 },
      ),
    [orders],
  );

  const deliveriesDueThisWeek = useMemo(() => {
    const now = new Date();
    const sevenDays = new Date();
    sevenDays.setDate(now.getDate() + 7);

    return orders.filter((order) => {
      const date = new Date(order.delivery_date);
      if (Number.isNaN(date.getTime())) return false;
      if (order.order_status === "CANCELLED" || order.order_status === "DELIVERED") return false;
      return date >= now && date <= sevenDays;
    }).length;
  }, [orders]);

  const topMetricCards = useMemo(() => {
    if (!customerProfile || !heroMetrics) return [];

    return [
      {
        id: "total-orders",
        label: "Total Orders",
        value: String(customerProfile.total_orders ?? 0),
      },
      {
        id: "total-spent",
        label: "Total Spent",
        value: formatCurrency(customerProfile.total_spent ?? 0),
      },
      {
        id: "partner-farmers",
        label: "Partner Farmers",
        value: String(heroMetrics.partner_farmers_count ?? 0),
      },
      {
        id: "repeat-rate",
        label: "Repeat Rate",
        value: `${heroMetrics.repeat_customer_rate ?? "0"}%`,
      },
    ];
  }, [customerProfile, heroMetrics]);

  const maxSpend = Math.max(...spendTrend.map((item) => item.value), 1);
  const minSpend = Math.min(...spendTrend.map((item) => item.value), 0);
  const chartWidth = 620;
  const chartHeight = 240;
  const xStep = chartWidth / Math.max(spendTrend.length - 1, 1);

  const points = spendTrend
    .map((item, index) => {
      const normalised = (item.value - minSpend) / Math.max(maxSpend - minSpend, 1);
      const x = index * xStep;
      const y = chartHeight - normalised * (chartHeight - 30) - 10;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  const statusOrder = (Object.keys(statusTotals) as OrderStatus[]).filter((status) => statusTotals[status] > 0);
  const totalStatuses = statusOrder.reduce((sum, status) => sum + statusTotals[status], 0);

  let runningTotal = 0;
  const donutStops = statusOrder
    .map((status) => {
      const start = totalStatuses ? (runningTotal / totalStatuses) * 100 : 0;
      runningTotal += statusTotals[status];
      const end = totalStatuses ? (runningTotal / totalStatuses) * 100 : 100;
      return `${statusMeta[status].color} ${start}% ${end}%`;
    })
    .join(", ");

  if (loading) {
    return (
      <section className="dash-page" aria-labelledby="dashboard-overview-title">
        <div className="rounded-2xl border border-secondary/25 bg-white p-5 text-sm text-primary/75">Loading dashboard data...</div>
      </section>
    );
  }

  if (errorMessage || !customerProfile || !heroMetrics) {
    return (
      <section className="dash-page" aria-labelledby="dashboard-overview-title">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-700">{errorMessage || "Unable to load dashboard overview."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dash-page" aria-labelledby="dashboard-overview-title">
      <div className="grid gap-4">
        <div className="rounded-2xl border border-secondary/25 bg-white p-5 shadow-[0_28px_50px_-42px_rgba(29,92,33,0.75)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Dashboard Overview</p>
          <h1 id="dashboard-overview-title" className="mt-2 text-2xl font-black text-primary sm:text-3xl">
            Welcome back, {customerProfile.user.full_name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-primary/80">
            Customer ID {customerProfile.customer_id} | {customerProfile.location}. Last metrics sync:{" "}
            {new Date(heroMetrics.last_updated).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topMetricCards.map((metric) => (
              <article
                key={metric.id}
                className="group relative flex min-h-[118px] flex-col justify-between overflow-hidden rounded-2xl border border-secondary/20 bg-white px-4 py-4 shadow-[0_18px_32px_-28px_rgba(29,92,33,0.45)]"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary via-accent-2 to-secondary/70"
                />
                <p className="pr-2 text-[11px] font-bold uppercase tracking-[0.11em] text-secondary">{metric.label}</p>
                <p className="mt-2 break-words text-[1.65rem] font-black leading-[1.15] text-primary lg:text-[1.55rem] xl:text-[1.75rem]">
                  <span className="block">{metric.value}</span>
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-secondary/25 bg-white p-5 lg:max-w-[640px]">
          <h2 className="text-lg font-black text-primary">Account Snapshot</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 border-b border-secondary/15 pb-2">
              <dt className="font-semibold text-primary/80">Email</dt>
              <dd className="text-right font-bold text-primary">{customerProfile.user.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-secondary/15 pb-2">
              <dt className="font-semibold text-primary/80">Mobile</dt>
              <dd className="text-right font-bold text-primary">{customerProfile.user.mobile_number}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-secondary/15 pb-2">
              <dt className="font-semibold text-primary/80">Typical Delivery Time</dt>
              <dd className="text-right font-bold text-primary">{heroMetrics.avg_delivery_window}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-primary/75">
            Estimated time from confirmed order to delivery, based on recent fulfilled orders in your area.
          </p>

          <div className="mt-5 grid gap-2">
            <Link
              href="/products"
              className="rounded-lg border border-primary bg-primary px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              Explore Products
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-2xl border border-secondary/25 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-primary">Spending Trend (6 months)</h2>
            <p className="text-xs font-semibold text-primary/70">Live from `/api/orders/history/`</p>
          </div>
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-[260px] min-w-[620px] w-full"
              role="img"
              aria-label="Line chart showing monthly spending trend over the last six months"
            >
              <defs>
                <linearGradient id="spendFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(120,165,15,0.35)" />
                  <stop offset="100%" stopColor="rgba(120,165,15,0.02)" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((line) => {
                const y = 20 + line * 55;
                return <line key={line} x1="0" x2={chartWidth} y1={y} y2={y} stroke="rgba(29,92,33,0.14)" strokeDasharray="5 6" />;
              })}
              <polygon points={areaPoints} fill="url(#spendFill)" />
              <polyline points={points} fill="none" stroke="var(--color-primary)" strokeWidth="3.5" strokeLinecap="round" />
              {spendTrend.map((item, index) => {
                const normalised = (item.value - minSpend) / Math.max(maxSpend - minSpend, 1);
                const x = index * xStep;
                const y = chartHeight - normalised * (chartHeight - 30) - 10;

                return (
                  <g key={item.label}>
                    <circle cx={x} cy={y} r="5.5" fill="var(--color-accent-2)" stroke="var(--color-primary)" strokeWidth="2" />
                    <text x={x} y={chartHeight - 6} textAnchor="middle" className="fill-primary text-[11px] font-semibold">
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </article>

        <article className="rounded-2xl border border-secondary/25 bg-white p-5">
          <h2 className="text-lg font-black text-primary">Order Status Mix</h2>
          <div className="mt-4 flex items-center gap-6">
            <div
              className="relative h-32 w-32 rounded-full border border-secondary/25"
              style={{ backgroundImage: `conic-gradient(${donutStops || "var(--color-secondary) 0% 100%"})` }}
              role="img"
              aria-label="Donut chart showing order status distribution"
            >
              <div className="absolute inset-[22px] rounded-full bg-white" />
            </div>
            <ul className="space-y-2">
              {statusOrder.map((status) => (
                <li key={status} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: statusMeta[status].color }} aria-hidden="true" />
                  <span className="font-semibold text-primary">{statusMeta[status].label}</span>
                  <span className="text-primary/80">({statusTotals[status]})</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-secondary/25 bg-white p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-primary">Recent Orders</h2>
            <Link
              href="/dashboard/orders"
              className="rounded-lg border border-secondary/35 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-secondary/20">
            <table className="min-w-full border-collapse text-left" aria-label="Recent order activity table">
              <thead className="bg-accent/15">
                <tr>
                  <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary">Order</th>
                  <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary">Product</th>
                  <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary">Bags</th>
                  <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary">Total</th>
                  <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-secondary/15">
                    <td className="px-3 py-2 text-sm font-semibold text-primary">{order.order_id}</td>
                    <td className="px-3 py-2 text-sm text-primary/90">{order.product_details?.name || `Product #${order.product}`}</td>
                    <td className="px-3 py-2 text-sm text-primary/90">{order.quantity_bags}</td>
                    <td className="px-3 py-2 text-sm font-semibold text-primary">{formatCurrency(order.total_price)}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-bold ${statusMeta[order.order_status].colorClass}`}>
                        {statusMeta[order.order_status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="grid gap-4">
          <article className="rounded-2xl border border-secondary/25 bg-white p-5">
            <h2 className="text-lg font-black text-primary">Operational Signals</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="rounded-lg border border-secondary/20 bg-white px-3 py-2 text-primary">
                Orders in processing queue: <strong>{statusTotals.PROCESSING}</strong>
              </li>
              <li className="rounded-lg border border-secondary/20 bg-white px-3 py-2 text-primary">
                Deliveries due this week: <strong>{deliveriesDueThisWeek}</strong>
              </li>
              <li className="rounded-lg border border-secondary/20 bg-white px-3 py-2 text-primary">
                Pending confirmations: <strong>{statusTotals.PENDING}</strong>
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-secondary/25 bg-white p-5">
            <h2 className="text-lg font-black text-primary">Announcements Preview</h2>
            <div className="mt-3 space-y-3">
              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <article key={item.id} className="rounded-xl border border-secondary/20 bg-white p-3">
                    <p className="text-sm font-bold text-primary">{item.title}</p>
                    <p className="mt-1 text-xs text-primary/80">{item.excerpt}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                      {new Date(item.published_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-xl border border-secondary/20 bg-white p-3 text-sm text-primary/75">No announcements yet.</p>
              )}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
};

export default DashboardOverview;