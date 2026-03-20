"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type TrackStatus = "PENDING" | "PROCESSING" | "DISPATCHED";
type DeliveryMethod = "PICKUP" | "DELIVERY";

type ActiveOrder = {
  id: number;
  order_id: string;
  product_name: string;
  quantity_bags: number;
  quantity_tons: string;
  total_price: string;
  payment_option: "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY";
  delivery_method: DeliveryMethod;
  delivery_address: string;
  delivery_date: string;
  order_status: TrackStatus;
  updated_at: string;
};

const statusStages: { id: TrackStatus | "DELIVERED"; label: string }[] = [
  { id: "PENDING", label: "Pending" },
  { id: "PROCESSING", label: "Processing" },
  { id: "DISPATCHED", label: "Dispatched" },
  { id: "DELIVERED", label: "Delivered" },
];

const statusToProgress: Record<TrackStatus, number> = {
  PENDING: 1,
  PROCESSING: 2,
  DISPATCHED: 3,
};

const statusBadgeClass: Record<TrackStatus, string> = {
  PENDING: "border-accent-2 bg-accent-2/25 text-primary",
  PROCESSING: "border-secondary bg-secondary/20 text-primary",
  DISPATCHED: "border-primary bg-primary text-white",
};

const statusLabel: Record<TrackStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  DISPATCHED: "Dispatched",
};

const simulatedActiveOrders: ActiveOrder[] = [
  {
    id: 57,
    order_id: "ORDA1B2C3D4E",
    product_name: "Premium Yellow Maize",
    quantity_bags: 20,
    quantity_tons: "1.200",
    total_price: "7000.00",
    payment_option: "MOBILE_MONEY",
    delivery_method: "DELIVERY",
    delivery_address: "Adenta, Accra",
    delivery_date: "2026-03-22",
    order_status: "PROCESSING",
    updated_at: "2026-03-20T10:15:21.001111Z",
  },
  {
    id: 58,
    order_id: "ORDG7H8J9K1L",
    product_name: "White Maize Grade A",
    quantity_bags: 12,
    quantity_tons: "0.720",
    total_price: "4140.00",
    payment_option: "BANK_TRANSFER",
    delivery_method: "DELIVERY",
    delivery_address: "Tema, Community 10",
    delivery_date: "2026-03-24",
    order_status: "PENDING",
    updated_at: "2026-03-20T12:35:00.000000Z",
  },
  {
    id: 54,
    order_id: "ORDS8T9U1V2W",
    product_name: "Premium Yellow Maize",
    quantity_bags: 16,
    quantity_tons: "0.960",
    total_price: "5600.00",
    payment_option: "MOBILE_MONEY",
    delivery_method: "DELIVERY",
    delivery_address: "Kumasi, Bantama",
    delivery_date: "2026-03-25",
    order_status: "DISPATCHED",
    updated_at: "2026-03-20T11:05:00.000000Z",
  },
  {
    id: 50,
    order_id: "ORDH1I2J3K4L",
    product_name: "Mixed Feed Maize",
    quantity_bags: 14,
    quantity_tons: "0.840",
    total_price: "4200.00",
    payment_option: "MOBILE_MONEY",
    delivery_method: "DELIVERY",
    delivery_address: "East Legon, Accra",
    delivery_date: "2026-03-27",
    order_status: "PROCESSING",
    updated_at: "2026-03-20T10:05:00.000000Z",
  },
];

const formatCurrency = (value: string) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(Number(value));

const DashboardOrderTracking = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TrackStatus>("ALL");

  const trackedOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return simulatedActiveOrders
      .filter((order) => {
        const matchesStatus = statusFilter === "ALL" ? true : order.order_status === statusFilter;
        const matchesQuery =
          normalizedQuery.length === 0
            ? true
            : order.order_id.toLowerCase().includes(normalizedQuery) ||
              order.product_name.toLowerCase().includes(normalizedQuery) ||
              order.delivery_address.toLowerCase().includes(normalizedQuery);
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [query, statusFilter]);

  const summary = useMemo(
    () => ({
      active: trackedOrders.length,
      dispatched: trackedOrders.filter((order) => order.order_status === "DISPATCHED").length,
      processing: trackedOrders.filter((order) => order.order_status === "PROCESSING").length,
      pending: trackedOrders.filter((order) => order.order_status === "PENDING").length,
    }),
    [trackedOrders],
  );

  return (
    <section className="dash-page" aria-labelledby="order-tracking-title">
      <header className="mb-6">
        <p className="inline-flex rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-secondary">
          Active Order Tracking (Simulated)
        </p>
        <h1 id="order-tracking-title" className="mt-3 text-2xl font-black text-primary sm:text-3xl">
          Track Active Orders
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-primary/80">
          This page mirrors customer tracking behavior for active orders. In production, map this to
          `/api/orders/history/` or `/api/orders/` filtered to non-delivered and non-cancelled orders.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-secondary/25 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">Active Orders</p>
          <p className="mt-2 text-2xl font-black text-primary">{summary.active}</p>
        </article>
        <article className="rounded-xl border border-secondary/25 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">Pending</p>
          <p className="mt-2 text-2xl font-black text-primary">{summary.pending}</p>
        </article>
        <article className="rounded-xl border border-secondary/25 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">Processing</p>
          <p className="mt-2 text-2xl font-black text-primary">{summary.processing}</p>
        </article>
        <article className="rounded-xl border border-secondary/25 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">Dispatched</p>
          <p className="mt-2 text-2xl font-black text-primary">{summary.dispatched}</p>
        </article>
      </div>

      <section className="mt-4 rounded-2xl border border-secondary/25 bg-white p-4" aria-label="Tracking filters">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px]">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Search Active Orders</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Order ID, product, delivery location"
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "ALL" | TrackStatus)}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              <option value="ALL">All active statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="DISPATCHED">Dispatched</option>
            </select>
          </label>
        </div>
      </section>

      <div className="mt-4 grid gap-4">
        {trackedOrders.length === 0 ? (
          <div className="rounded-2xl border border-secondary/25 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-primary">No active orders match your filters.</p>
          </div>
        ) : (
          trackedOrders.map((order) => {
            const currentStep = statusToProgress[order.order_status];
            const progressPercent = (currentStep / (statusStages.length - 1)) * 100;

            return (
              <article key={order.id} className="rounded-2xl border border-secondary/25 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-primary">{order.order_id}</p>
                    <h2 className="mt-1 text-lg font-black text-primary">{order.product_name}</h2>
                    <p className="mt-1 text-xs text-primary/75">
                      {order.quantity_bags} bags ({order.quantity_tons} tons) • {formatCurrency(order.total_price)}
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusBadgeClass[order.order_status]}`}>
                    {statusLabel[order.order_status]}
                  </span>
                </div>

                <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-secondary">Delivery</dt>
                    <dd className="mt-1 text-sm text-primary">
                      {order.delivery_method} • {order.delivery_date}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-secondary">Address / Pickup</dt>
                    <dd className="mt-1 text-sm text-primary">{order.delivery_address}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-secondary">Payment</dt>
                    <dd className="mt-1 text-sm text-primary">{order.payment_option}</dd>
                  </div>
                </dl>

                <div className="mt-5">
                  <div className="relative h-2 rounded-full bg-secondary/20" aria-hidden="true">
                    <div
                      className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-secondary to-primary transition-[width] duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <ol className="mt-3 grid grid-cols-4 gap-2" aria-label={`Progress steps for order ${order.order_id}`}>
                    {statusStages.map((stage, index) => {
                      const stepIndex = index + 1;
                      const isComplete = stepIndex <= currentStep;
                      const isCurrent = stepIndex === currentStep;

                      return (
                        <li key={stage.id} className="text-center">
                          <span
                            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold ${
                              isComplete
                                ? "border-primary bg-primary text-white"
                                : "border-secondary/30 bg-white text-primary/55"
                            } ${isCurrent ? "ring-2 ring-accent-2/70 ring-offset-1 ring-offset-white" : ""}`}
                            aria-current={isCurrent ? "step" : undefined}
                          >
                            {stepIndex}
                          </span>
                          <span className={`mt-1 block text-[11px] font-semibold ${isComplete ? "text-primary" : "text-primary/60"}`}>
                            {stage.label}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="mt-5 rounded-xl border border-secondary/25 bg-white p-4 text-sm text-primary/80">
        Completed or cancelled records are available in
        <Link
          href="/dashboard/orders"
          className="ml-1 rounded font-semibold text-primary underline decoration-accent-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
        >
          Order History
        </Link>
        .
      </div>
    </section>
  );
};

export default DashboardOrderTracking;
