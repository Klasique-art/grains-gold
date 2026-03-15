import {
  HomeAnnouncement,
  HomeBenefit,
  HomeHeroStat,
  HomeProductPreview,
  HomeStep,
  HomeTestimonial,
} from "@/types";

export const homeHeroStats: HomeHeroStat[] = [
  { id: "farmers", label: "Partner Farmers", value: "120+" },
  { id: "delivery", label: "Avg. Delivery", value: "24 - 48 hrs" },
  { id: "repeat", label: "Repeat Customers", value: "87%" },
];

export const homeBenefits: HomeBenefit[] = [
  {
    id: "quality",
    title: "Clean, sorted maize",
    description:
      "Every bag is sorted and quality-checked before dispatch, reducing post-delivery losses for homes and businesses.",
  },
  {
    id: "pricing",
    title: "Transparent pricing",
    description:
      "Public price list by bag and ton, with availability status updated so buyers can plan with confidence.",
  },
  {
    id: "logistics",
    title: "Reliable fulfillment",
    description:
      "From confirmation to dispatch, customers get clear status updates and support across delivery and pickups.",
  },
];

export const homeProductPreview: HomeProductPreview[] = [
  {
    id: "yellow-maize",
    name: "Premium Yellow Maize",
    packaging: "50kg bag",
    pricePerBag: "GHS 420",
    pricePerTon: "GHS 7,950",
    availability: "Available",
    summary: "Ideal for feed mills and high-volume processing.",
  },
  {
    id: "white-maize",
    name: "White Maize (Food Grade)",
    packaging: "50kg bag",
    pricePerBag: "GHS 445",
    pricePerTon: "GHS 8,400",
    availability: "Low Stock",
    summary: "Preferred by food vendors and household bulk buyers.",
  },
  {
    id: "grits-maize",
    name: "Grits-Ready Maize",
    packaging: "50kg bag",
    pricePerBag: "GHS 460",
    pricePerTon: "GHS 8,700",
    availability: "Available",
    summary: "Consistent kernel profile for processing plants.",
  },
];

export const homeHowItWorks: HomeStep[] = [
  {
    id: "create-account",
    title: "Create your customer account",
    description: "Register in minutes with your contact details and preferred location.",
  },
  {
    id: "compare-products",
    title: "Review products",
    description: "Compare maize type, packaging, price per bag/ton, and availability before ordering.",
  },
  {
    id: "place-order",
    title: "Place order and track status",
    description: "Submit your order from the dashboard and get updates until fulfillment.",
  },
];

export const homeTestimonials: HomeTestimonial[] = [
  {
    id: "adjoa",
    customerName: "Adjoa Mensah",
    role: "Retail buyer, Kumasi",
    quote:
      "Pricing is clear, delivery is predictable, and the grain quality has stayed consistent for every order we placed.",
  },
  {
    id: "sulemana",
    customerName: "Sulemana Yakubu",
    role: "Poultry operator, Tamale",
    quote:
      "The dashboard updates and direct WhatsApp support make reordering easy for our weekly production schedule.",
  },
  {
    id: "akua",
    customerName: "Akua Ofori",
    role: "Food processor, Accra",
    quote:
      "What sold us was the transparency: bag and ton prices visible upfront and no surprises during fulfillment.",
  },
];

export const homeAnnouncements: HomeAnnouncement[] = [
  {
    id: "new-harvest",
    title: "New harvest stock update for Q2 supply",
    excerpt: "Fresh stock batches now listed with updated pricing and expanded availability windows.",
    publishedAt: "March 8, 2026",
    href: "/announcements/new-harvest-q2",
  },
  {
    id: "quote-support",
    title: "Bulk quote response now within same business day",
    excerpt: "Customers requesting tonnage quotes now receive pricing response windows faster than before.",
    publishedAt: "March 2, 2026",
    href: "/announcements/quote-response-update",
  },
  {
    id: "delivery-zones",
    title: "Delivery zones expanded across Northern Corridor",
    excerpt: "We now support additional routes to improve coverage for processors and resellers.",
    publishedAt: "February 22, 2026",
    href: "/announcements/delivery-zones-expanded",
  },
];
