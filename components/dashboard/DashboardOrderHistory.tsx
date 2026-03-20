"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ConfirmModal } from "@/components";

type OrderStatus = "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
type PaymentOption = "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY";
type DeliveryMethod = "PICKUP" | "DELIVERY";

type SimulatedOrder = {
  id: number;
  order_id: string;
  product_name: string;
  quantity_bags: number;
  quantity_tons: string;
  unit_price: string;
  total_price: string;
  delivery_method: DeliveryMethod;
  delivery_address: string;
  delivery_date: string;
  payment_option: PaymentOption;
  order_status: OrderStatus;
  customer_notes: string;
  admin_notes: string;
  approved_by_name: string;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

const initialOrders: SimulatedOrder[] = [
  {
    id: 57,
    order_id: "ORDA1B2C3D4E",
    product_name: "Premium Yellow Maize",
    quantity_bags: 20,
    quantity_tons: "1.200",
    unit_price: "350.00",
    total_price: "7000.00",
    delivery_method: "DELIVERY",
    delivery_address: "Adenta, Accra",
    delivery_date: "2026-03-22",
    payment_option: "MOBILE_MONEY",
    order_status: "PROCESSING",
    customer_notes: "",
    admin_notes: "",
    approved_by_name: "Admin User",
    approved_at: "2026-03-20T10:15:21.001111Z",
    created_at: "2026-03-20T09:58:00.000000Z",
    updated_at: "2026-03-20T10:15:21.001111Z",
  },
  {
    id: 58,
    order_id: "ORDG7H8J9K1L",
    product_name: "White Maize Grade A",
    quantity_bags: 12,
    quantity_tons: "0.720",
    unit_price: "345.00",
    total_price: "4140.00",
    delivery_method: "DELIVERY",
    delivery_address: "Tema, Community 10",
    delivery_date: "2026-03-24",
    payment_option: "BANK_TRANSFER",
    order_status: "PENDING",
    customer_notes: "Call before dispatch",
    admin_notes: "",
    approved_by_name: "",
    approved_at: null,
    created_at: "2026-03-20T12:35:00.000000Z",
    updated_at: "2026-03-20T12:35:00.000000Z",
  },
  {
    id: 55,
    order_id: "ORDM2N3P4Q5R",
    product_name: "Mixed Feed Maize",
    quantity_bags: 30,
    quantity_tons: "1.800",
    unit_price: "300.00",
    total_price: "9000.00",
    delivery_method: "PICKUP",
    delivery_address: "Main Warehouse",
    delivery_date: "2026-03-18",
    payment_option: "CASH",
    order_status: "DELIVERED",
    customer_notes: "",
    admin_notes: "Collected successfully.",
    approved_by_name: "Admin User",
    approved_at: "2026-03-18T07:42:00.000000Z",
    created_at: "2026-03-17T15:11:00.000000Z",
    updated_at: "2026-03-18T09:32:00.000000Z",
  },
  {
    id: 54,
    order_id: "ORDS8T9U1V2W",
    product_name: "Premium Yellow Maize",
    quantity_bags: 16,
    quantity_tons: "0.960",
    unit_price: "350.00",
    total_price: "5600.00",
    delivery_method: "DELIVERY",
    delivery_address: "Kumasi, Bantama",
    delivery_date: "2026-03-25",
    payment_option: "MOBILE_MONEY",
    order_status: "DISPATCHED",
    customer_notes: "Evening delivery preferred",
    admin_notes: "Truck en route.",
    approved_by_name: "Admin User",
    approved_at: "2026-03-20T07:22:00.000000Z",
    created_at: "2026-03-19T11:18:00.000000Z",
    updated_at: "2026-03-20T11:05:00.000000Z",
  },
  {
    id: 53,
    order_id: "ORDX5Y6Z7A8B",
    product_name: "White Maize Grade A",
    quantity_bags: 10,
    quantity_tons: "0.600",
    unit_price: "345.00",
    total_price: "3450.00",
    delivery_method: "DELIVERY",
    delivery_address: "Kasoa, Ofaakor",
    delivery_date: "2026-03-19",
    payment_option: "BANK_TRANSFER",
    order_status: "CANCELLED",
    customer_notes: "",
    admin_notes: "Cancelled by customer request.",
    approved_by_name: "",
    approved_at: null,
    created_at: "2026-03-18T08:14:00.000000Z",
    updated_at: "2026-03-18T10:02:00.000000Z",
  },
  {
    id: 51,
    order_id: "ORDC4D5E6F7G",
    product_name: "Premium Yellow Maize",
    quantity_bags: 22,
    quantity_tons: "1.320",
    unit_price: "350.00",
    total_price: "7700.00",
    delivery_method: "PICKUP",
    delivery_address: "Main Warehouse",
    delivery_date: "2026-03-16",
    payment_option: "CASH",
    order_status: "DELIVERED",
    customer_notes: "",
    admin_notes: "Picked up on schedule.",
    approved_by_name: "Admin User",
    approved_at: "2026-03-15T06:02:00.000000Z",
    created_at: "2026-03-14T17:28:00.000000Z",
    updated_at: "2026-03-16T12:01:00.000000Z",
  },
  {
    id: 50,
    order_id: "ORDH1I2J3K4L",
    product_name: "Mixed Feed Maize",
    quantity_bags: 14,
    quantity_tons: "0.840",
    unit_price: "300.00",
    total_price: "4200.00",
    delivery_method: "DELIVERY",
    delivery_address: "East Legon, Accra",
    delivery_date: "2026-03-27",
    payment_option: "MOBILE_MONEY",
    order_status: "PROCESSING",
    customer_notes: "Deliver before noon",
    admin_notes: "",
    approved_by_name: "Admin User",
    approved_at: "2026-03-20T10:05:00.000000Z",
    created_at: "2026-03-19T09:03:00.000000Z",
    updated_at: "2026-03-20T10:05:00.000000Z",
  },
];

const pageSize = 5;

const statusLabel: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  DISPATCHED: "Dispatched",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusBadgeClass: Record<OrderStatus, string> = {
  PENDING: "border-accent-2 bg-accent-2/25 text-primary",
  PROCESSING: "border-secondary bg-secondary/20 text-primary",
  DISPATCHED: "border-primary bg-primary/15 text-primary",
  DELIVERED: "border-primary bg-primary text-white",
  CANCELLED: "border-black/30 bg-black/10 text-black",
};

const canCancel = (status: OrderStatus) => ["PENDING", "PROCESSING", "DISPATCHED"].includes(status);

const formatCurrency = (value: string) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(Number(value));

const DashboardOrderHistory = () => {
  const [orders, setOrders] = useState<SimulatedOrder[]>(initialOrders);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [deliveryFilter, setDeliveryFilter] = useState<"ALL" | DeliveryMethod>("ALL");
  const [sortBy, setSortBy] = useState<"-created_at" | "created_at" | "-total_price" | "total_price">("-created_at");
  const [currentPage, setCurrentPage] = useState(1);
  const [targetCancelId, setTargetCancelId] = useState<number | null>(null);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let data = orders.filter((order) => {
      const matchesStatus = statusFilter === "ALL" ? true : order.order_status === statusFilter;
      const matchesDelivery = deliveryFilter === "ALL" ? true : order.delivery_method === deliveryFilter;
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : order.order_id.toLowerCase().includes(normalizedQuery) ||
            order.product_name.toLowerCase().includes(normalizedQuery) ||
            order.delivery_address.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesDelivery && matchesQuery;
    });

    data = [...data].sort((a, b) => {
      if (sortBy === "-created_at") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "created_at") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "-total_price") return Number(b.total_price) - Number(a.total_price);
      return Number(a.total_price) - Number(b.total_price);
    });

    return data;
  }, [orders, query, statusFilter, deliveryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage]);

  const totals = useMemo(
    () => ({
      count: filteredOrders.length,
      spend: filteredOrders.reduce((sum, order) => sum + Number(order.total_price), 0),
      processing: filteredOrders.filter((order) => order.order_status === "PROCESSING").length,
      delivered: filteredOrders.filter((order) => order.order_status === "DELIVERED").length,
    }),
    [filteredOrders],
  );

  const resetToPageOne = () => setCurrentPage(1);

  const applyCancel = () => {
    if (targetCancelId === null) {
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === targetCancelId
          ? {
              ...order,
              order_status: "CANCELLED",
              admin_notes: "Cancelled by customer request (simulated).",
              updated_at: new Date().toISOString(),
            }
          : order,
      ),
    );
    setTargetCancelId(null);
  };

  return (
    <section className="dash-page" aria-labelledby="order-history-title">
      <header className="mb-6">
        <p className="inline-flex rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-secondary">
          /api/orders/history/ simulation
        </p>
        <h1 id="order-history-title" className="mt-3 text-2xl font-black text-primary sm:text-3xl">
          Order History
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-primary/80">
          This screen mimics the backend contract for personal order history, filters, sorting, pagination, and cancel
          flow. Replace local data with API responses when integration starts.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-secondary/25 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">Visible Orders</p>
          <p className="mt-2 text-2xl font-black text-primary">{totals.count}</p>
        </article>
        <article className="rounded-xl border border-secondary/25 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">Visible Total Value</p>
          <p className="mt-2 text-2xl font-black text-primary">{formatCurrency(String(totals.spend))}</p>
        </article>
        <article className="rounded-xl border border-secondary/25 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">Processing</p>
          <p className="mt-2 text-2xl font-black text-primary">{totals.processing}</p>
        </article>
        <article className="rounded-xl border border-secondary/25 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">Delivered</p>
          <p className="mt-2 text-2xl font-black text-primary">{totals.delivered}</p>
        </article>
      </div>

      <section className="mt-4 rounded-2xl border border-secondary/25 bg-white p-4" aria-label="Order history controls">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Search</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetToPageOne();
              }}
              type="search"
              placeholder="Order ID, product, location"
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as "ALL" | OrderStatus);
                resetToPageOne();
              }}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Delivery Method</span>
            <select
              value={deliveryFilter}
              onChange={(event) => {
                setDeliveryFilter(event.target.value as "ALL" | DeliveryMethod);
                resetToPageOne();
              }}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              <option value="ALL">All methods</option>
              <option value="DELIVERY">Delivery</option>
              <option value="PICKUP">Pickup</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Sort</span>
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as typeof sortBy);
                resetToPageOne();
              }}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              <option value="-created_at">Newest first</option>
              <option value="created_at">Oldest first</option>
              <option value="-total_price">Highest value</option>
              <option value="total_price">Lowest value</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-secondary/25 bg-white">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full border-collapse text-left" aria-label="Order history table">
            <thead className="bg-accent/15">
              <tr>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-primary">Order</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-primary">Product</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-primary">Delivery</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-primary">Payment</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-primary">Value</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-primary">Status</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-primary">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-t border-secondary/15">
                  <td className="px-3 py-3 align-top text-sm">
                    <p className="font-bold text-primary">{order.order_id}</p>
                    <p className="mt-1 text-xs text-primary/70">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-3 py-3 align-top text-sm text-primary/90">
                    <p className="font-semibold text-primary">{order.product_name}</p>
                    <p className="text-xs text-primary/75">
                      {order.quantity_bags} bags ({order.quantity_tons} tons)
                    </p>
                  </td>
                  <td className="px-3 py-3 align-top text-sm text-primary/90">
                    <p className="font-semibold">{order.delivery_method}</p>
                    <p className="mt-1 text-xs text-primary/70">{order.delivery_address}</p>
                    <p className="mt-1 text-xs text-primary/70">By {order.delivery_date}</p>
                  </td>
                  <td className="px-3 py-3 align-top text-sm text-primary/90">{order.payment_option}</td>
                  <td className="px-3 py-3 align-top text-sm font-bold text-primary">{formatCurrency(order.total_price)}</td>
                  <td className="px-3 py-3 align-top text-sm">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusBadgeClass[order.order_status]}`}>
                      {statusLabel[order.order_status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-top text-sm">
                    {canCancel(order.order_status) ? (
                      <button
                        type="button"
                        onClick={() => setTargetCancelId(order.id)}
                        className="rounded-lg border border-black/25 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-primary/60">Unavailable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-3 md:hidden">
          {paginatedOrders.map((order) => (
            <article key={order.id} className="rounded-xl border border-secondary/20 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-primary">{order.order_id}</p>
                  <p className="text-xs text-primary/70">{order.product_name}</p>
                </div>
                <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-bold ${statusBadgeClass[order.order_status]}`}>
                  {statusLabel[order.order_status]}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="font-semibold text-secondary">Bags</dt>
                  <dd className="text-primary">{order.quantity_bags}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-secondary">Total</dt>
                  <dd className="text-primary">{formatCurrency(order.total_price)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-secondary">Delivery</dt>
                  <dd className="text-primary">{order.delivery_method}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-secondary">Payment</dt>
                  <dd className="text-primary">{order.payment_option}</dd>
                </div>
              </dl>

              {canCancel(order.order_status) ? (
                <button
                  type="button"
                  onClick={() => setTargetCancelId(order.id)}
                  className="mt-3 w-full rounded-lg border border-black/25 px-3 py-2 text-xs font-bold text-primary transition hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                >
                  Cancel Order
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-secondary/25 bg-white px-4 py-3">
        <p className="text-sm text-primary/80">
          Showing {paginatedOrders.length} of {filteredOrders.length} orders
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-secondary/35 px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            Previous
          </button>
          <p className="min-w-[84px] text-center text-sm font-semibold text-primary">
            {currentPage} / {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-secondary/35 px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-secondary/25 bg-white p-4 text-sm text-primary/80">
        Next API swap: replace `initialOrders` with `GET /api/orders/history/` and, for paginated mode, use
        `GET /api/orders/?page=...&order_status=...&ordering=...`.
        <Link
          href="/docs/FRONTEND_ORDER_HISTORY_GUIDE.md"
          className="ml-2 rounded font-semibold text-primary underline decoration-accent-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
        >
          Frontend order history guide
        </Link>
      </div>

      <ConfirmModal
        open={targetCancelId !== null}
        title="Cancel this order?"
        description="This is simulated for now. In real integration, this would call PATCH /api/orders/{id}/cancel/."
        confirmLabel="Yes, cancel order"
        cancelLabel="Keep order"
        onClose={() => setTargetCancelId(null)}
        onConfirm={applyCancel}
      />
    </section>
  );
};

export default DashboardOrderHistory;
