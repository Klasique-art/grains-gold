"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { ConfirmModal } from "@/components";
import { cancelOrder, DeliveryMethod, getMyOrderHistory, getMyOrdersPage, OrderItem, OrderStatus } from "@/app/lib/ordersClient";

const PAGE_SIZE = 5;

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

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(Number(value));

const DashboardOrderHistory = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [deliveryFilter, setDeliveryFilter] = useState<"ALL" | DeliveryMethod>("ALL");
  const [sortBy, setSortBy] = useState<"-created_at" | "created_at" | "-total_price" | "total_price">("-created_at");
  const [currentPage, setCurrentPage] = useState(1);

  const [pagedOrders, setPagedOrders] = useState<OrderItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<OrderItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [targetCancelId, setTargetCancelId] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const applyLocalFilter = useCallback((orders: OrderItem[]) => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "ALL" ? true : order.order_status === statusFilter;
      const matchesDelivery = deliveryFilter === "ALL" ? true : order.delivery_method === deliveryFilter;
      const productName = order.product_details?.name ?? `Product #${order.product}`;
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : order.order_id.toLowerCase().includes(normalizedQuery) ||
            productName.toLowerCase().includes(normalizedQuery) ||
            order.delivery_address.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesDelivery && matchesQuery;
    });
  }, [deliveryFilter, query, statusFilter]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [pageData, historyData] = await Promise.all([
          getMyOrdersPage({
            page: currentPage,
            page_size: PAGE_SIZE,
            order_status: statusFilter === "ALL" ? undefined : statusFilter,
            delivery_method: deliveryFilter === "ALL" ? undefined : deliveryFilter,
            ordering: sortBy,
            search: query.trim() || undefined,
          }),
          getMyOrderHistory(),
        ]);

        if (controller.signal.aborted) return;

        setPagedOrders(pageData.results);
        setTotalCount(pageData.count);
        setFilteredHistory(applyLocalFilter(historyData));

        const totalPages = Math.max(1, Math.ceil(pageData.count / PAGE_SIZE));
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message: unknown }).message)
            : "Unable to load order history.";

        setErrorMessage(message);
        setPagedOrders([]);
        setFilteredHistory([]);
        setTotalCount(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [applyLocalFilter, currentPage, deliveryFilter, query, sortBy, statusFilter]);

  const totals = useMemo(
    () => ({
      count: filteredHistory.length,
      spend: filteredHistory.reduce((sum, order) => sum + Number(order.total_price), 0),
      processing: filteredHistory.filter((order) => order.order_status === "PROCESSING").length,
      delivered: filteredHistory.filter((order) => order.order_status === "DELIVERED").length,
    }),
    [filteredHistory],
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagedOrders.length, 1)));

  const onFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  const refreshAfterMutation = async () => {
    const [pageData, historyData] = await Promise.all([
      getMyOrdersPage({
        page: currentPage,
        page_size: PAGE_SIZE,
        order_status: statusFilter === "ALL" ? undefined : statusFilter,
        delivery_method: deliveryFilter === "ALL" ? undefined : deliveryFilter,
        ordering: sortBy,
        search: query.trim() || undefined,
      }),
      getMyOrderHistory(),
    ]);

    setPagedOrders(pageData.results);
    setTotalCount(pageData.count);
    setFilteredHistory(applyLocalFilter(historyData));
  };

  const applyCancel = async () => {
    if (targetCancelId === null || cancelLoading) return;

    setCancelLoading(true);
    setErrorMessage("");

    try {
      await cancelOrder(targetCancelId, "Cancelled by customer request");
      setTargetCancelId(null);
      await refreshAfterMutation();
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message: unknown }).message)
          : "Unable to cancel order.";

      setErrorMessage(message);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <section className="dash-page" aria-labelledby="order-history-title">
      <header className="mb-6">
        <p className="inline-flex rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-secondary">
          Live Data
        </p>
        <h1 id="order-history-title" className="mt-3 text-2xl font-black text-primary sm:text-3xl">
          Order History
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-primary/80">
          Your order history is now loaded from backend endpoints with server-side filtering, sorting, and pagination.
        </p>
      </header>

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{errorMessage}</div>
      ) : null}

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
              onChange={(event) => onFilterChange(() => setQuery(event.target.value))}
              type="search"
              placeholder="Order ID, product, location"
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => onFilterChange(() => setStatusFilter(event.target.value as "ALL" | OrderStatus))}
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
              onChange={(event) => onFilterChange(() => setDeliveryFilter(event.target.value as "ALL" | DeliveryMethod))}
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
              onChange={(event) => onFilterChange(() => setSortBy(event.target.value as typeof sortBy))}
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
              {pagedOrders.map((order) => (
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
                    <p className="font-semibold text-primary">{order.product_details?.name || `Product #${order.product}`}</p>
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
              {!loading && pagedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-5 text-center text-sm font-medium text-primary/70">
                    No orders found for current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-3 md:hidden">
          {pagedOrders.map((order) => (
            <article key={order.id} className="rounded-xl border border-secondary/20 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-primary">{order.order_id}</p>
                  <p className="text-xs text-primary/70">{order.product_details?.name || `Product #${order.product}`}</p>
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
          Showing {pagedOrders.length} of {totalCount} orders
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1 || loading}
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
            disabled={currentPage === totalPages || loading}
            className="rounded-lg border border-secondary/35 px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmModal
        open={targetCancelId !== null}
        title="Cancel this order?"
        description="This action will send a cancellation request to the backend."
        confirmLabel={cancelLoading ? "Cancelling..." : "Yes, cancel order"}
        cancelLabel="Keep order"
        onClose={() => (cancelLoading ? null : setTargetCancelId(null))}
        onConfirm={() => {
          void applyCancel();
        }}
      />

      <div className="mt-4">
        <Link
          href="/dashboard/place-order"
          className="inline-flex rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
        >
          Place New Order
        </Link>
      </div>
    </section>
  );
};

export default DashboardOrderHistory;
