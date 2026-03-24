"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createOrder } from "@/app/lib/ordersClient";
import { fetchProducts } from "@/app/lib/productsClient";

type DeliveryMethod = "PICKUP" | "DELIVERY";
type PaymentOption = "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY";

type ProductOption = {
  id: number;
  name: string;
  price_per_bag: string;
  currency: string;
  packaging_size: string;
  availability_status: string;
};

const formatPrice = (price: string, currency = "GHS") => {
  const numeric = Number.parseFloat(price);
  if (Number.isNaN(numeric)) return price;
  return `${currency} ${numeric.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const DashboardPlaceOrder = () => {
  const searchParams = useSearchParams();
  const preselectedProduct = Number.parseInt(searchParams.get("product") ?? "", 10);

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [productId, setProductId] = useState("");
  const [quantityBags, setQuantityBags] = useState("5");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("DELIVERY");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("MOBILE_MONEY");
  const [customerNotes, setCustomerNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetchProducts({ page: 1, page_size: 100 }, controller.signal);
        const options = response.results
          .filter((item) => item.availability_status !== "OUT_OF_STOCK")
          .map((item) => ({
            id: item.id,
            name: item.name,
            price_per_bag: item.price_per_bag,
            currency: item.currency,
            packaging_size: item.packaging_size,
            availability_status: item.availability_status,
          }));

        setProducts(options);
      } catch {
        setProducts([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProducts(false);
        }
      }
    };

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    if (!Number.isNaN(preselectedProduct)) {
      const found = products.find((product) => product.id === preselectedProduct);
      if (found) {
        setProductId(String(found.id));
        return;
      }
    }

    if (!productId) {
      setProductId(String(products[0].id));
    }
  }, [preselectedProduct, productId, products]);

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === productId) ?? null,
    [productId, products],
  );

  const computedTons = useMemo(() => {
    const bags = Number.parseFloat(quantityBags);
    if (Number.isNaN(bags) || bags <= 0) return "0.000";
    return (bags * 0.05).toFixed(3);
  }, [quantityBags]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const bags = Number.parseFloat(quantityBags);

    if (!selectedProduct) {
      setErrorMessage("Please select a product.");
      return;
    }

    if (Number.isNaN(bags) || bags <= 0) {
      setErrorMessage("Quantity (bags) must be greater than zero.");
      return;
    }

    if (deliveryMethod === "DELIVERY" && !deliveryAddress.trim()) {
      setErrorMessage("Delivery address is required when delivery method is DELIVERY.");
      return;
    }

    setSubmitting(true);

    try {
      await createOrder({
        product: selectedProduct.id,
        quantity_bags: Math.round(bags),
        quantity_tons: computedTons,
        unit_price: selectedProduct.price_per_bag,
        delivery_method: deliveryMethod,
        delivery_address: deliveryMethod === "DELIVERY" ? deliveryAddress.trim() : "",
        payment_option: paymentOption,
        customer_notes: customerNotes.trim(),
      });

      setSuccessMessage("Order placed successfully. You can track it in Order History.");
      setCustomerNotes("");
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message: unknown }).message)
          : "Unable to place order right now.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="dash-page" aria-labelledby="place-order-title">
      <header className="mb-6">
        <p className="inline-flex rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-secondary">
          Customer Dashboard
        </p>
        <h1 id="place-order-title" className="mt-3 text-2xl font-black text-primary sm:text-3xl">
          Place Order
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-primary/80">
          Select a product, provide quantity and delivery details, then submit your order.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-secondary/25 bg-white p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Product</span>
            <select
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              disabled={loadingProducts || products.length === 0}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              {products.length === 0 ? <option value="">No products available</option> : null}
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({formatPrice(product.price_per_bag, product.currency)} / bag)
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Quantity (bags)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={quantityBags}
              onChange={(event) => setQuantityBags(event.target.value)}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Estimated tons</span>
            <input
              type="text"
              value={computedTons}
              readOnly
              className="h-11 rounded-xl border border-secondary/25 bg-secondary/5 px-3 text-sm font-semibold text-primary"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Delivery method</span>
            <select
              value={deliveryMethod}
              onChange={(event) => setDeliveryMethod(event.target.value as DeliveryMethod)}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              <option value="DELIVERY">Delivery</option>
              <option value="PICKUP">Pickup</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Payment option</span>
            <select
              value={paymentOption}
              onChange={(event) => setPaymentOption(event.target.value as PaymentOption)}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">
              Delivery address {deliveryMethod === "DELIVERY" ? "(Required)" : "(Optional)"}
            </span>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              placeholder={deliveryMethod === "DELIVERY" ? "Enter delivery location" : "Optional for pickup"}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Customer notes (optional)</span>
            <textarea
              value={customerNotes}
              onChange={(event) => setCustomerNotes(event.target.value)}
              rows={3}
              className="rounded-xl border border-secondary/35 px-3 py-2 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              placeholder="Any delivery instructions or order notes"
            />
          </label>
        </div>

        {selectedProduct ? (
          <div className="mt-4 rounded-xl border border-secondary/25 bg-secondary/5 px-4 py-3 text-sm text-primary/85">
            Unit price: <strong>{formatPrice(selectedProduct.price_per_bag, selectedProduct.currency)}</strong> per bag | Packaging: {" "}
            <strong>{selectedProduct.packaging_size}</strong>
          </div>
        ) : null}

        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{errorMessage}</p>
        ) : null}

        {successMessage ? (
          <p className="mt-4 rounded-lg border border-secondary/30 bg-accent/25 px-3 py-2 text-sm font-semibold text-primary">{successMessage}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={submitting || loadingProducts || !selectedProduct}
            className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </button>
          <Link
            href="/dashboard/orders"
            className="rounded-lg border border-secondary/40 px-4 py-2 text-sm font-bold text-primary transition hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            View Order History
          </Link>
        </div>
      </form>
    </section>
  );
};

export default DashboardPlaceOrder;