import { ProductCategory, ProductFaq, ProductItem } from "@/types";

export const productCategories: ProductCategory[] = [
  {
    id: "yellow",
    title: "Yellow Maize",
    description: "Best suited for feed mills and livestock businesses requiring consistent energy-rich grain.",
  },
  {
    id: "white",
    title: "White Maize",
    description: "Preferred for food-grade use including household consumption and processing.",
  },
  {
    id: "industrial",
    title: "Industrial Grade",
    description: "Prepared for large-scale processors with repeat volume needs.",
  },
];

export const productItems: ProductItem[] = [
  {
    id: "p1",
    slug: "premium-yellow-maize",
    name: "Premium Yellow Maize",
    categoryId: "yellow",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop",
    maizeType: "Yellow Maize",
    packagingSize: "50kg bag",
    pricePerBag: "GHS 420",
    pricePerTon: "GHS 7,950",
    availability: "AVAILABLE",
    minOrder: "5 bags",
    summary: "Clean sorted kernels with stable quality for repeat feed operations.",
  },
  {
    id: "p2",
    slug: "classic-yellow-maize",
    name: "Classic Yellow Maize",
    categoryId: "yellow",
    image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=1200&auto=format&fit=crop",
    maizeType: "Yellow Maize",
    packagingSize: "50kg bag",
    pricePerBag: "GHS 390",
    pricePerTon: "GHS 7,350",
    availability: "LOW_STOCK",
    minOrder: "3 bags",
    summary: "Cost-efficient option for high-volume buyers balancing price and quality.",
  },
  {
    id: "p3",
    slug: "food-grade-white-maize",
    name: "Food Grade White Maize",
    categoryId: "white",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop",
    maizeType: "White Maize",
    packagingSize: "50kg bag",
    pricePerBag: "GHS 445",
    pricePerTon: "GHS 8,400",
    availability: "AVAILABLE",
    minOrder: "5 bags",
    summary: "Carefully selected maize for food processing and household bulk supply.",
  },
  {
    id: "p4",
    slug: "white-maize-standard",
    name: "White Maize Standard",
    categoryId: "white",
    image: "https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?q=80&w=1200&auto=format&fit=crop",
    maizeType: "White Maize",
    packagingSize: "50kg bag",
    pricePerBag: "GHS 410",
    pricePerTon: "GHS 7,900",
    availability: "OUT_OF_STOCK",
    minOrder: "5 bags",
    summary: "Popular for local markets; restock notifications available for signed-in customers.",
  },
  {
    id: "p5",
    slug: "industrial-maize-lot-a",
    name: "Industrial Maize Lot A",
    categoryId: "industrial",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1200&auto=format&fit=crop",
    maizeType: "Mixed Industrial Grade",
    packagingSize: "1 ton unit",
    pricePerBag: "N/A",
    pricePerTon: "GHS 8,700",
    availability: "AVAILABLE",
    minOrder: "2 tons",
    summary: "Designed for processors requiring batch consistency and tonnage dispatch.",
  },
  {
    id: "p6",
    slug: "industrial-maize-lot-b",
    name: "Industrial Maize Lot B",
    categoryId: "industrial",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
    maizeType: "Mixed Industrial Grade",
    packagingSize: "1 ton unit",
    pricePerBag: "N/A",
    pricePerTon: "GHS 8,250",
    availability: "LOW_STOCK",
    minOrder: "3 tons",
    summary: "Volume-friendly lot with limited dispatch windows across select zones.",
  },
];

export const productFaqs: ProductFaq[] = [
  {
    id: "f1",
    question: "Can I view prices without creating an account?",
    answer:
      "Yes. Product pricing and availability are public. You only need an account when placing an order.",
  },
  {
    id: "f2",
    question: "What happens when I click Order Now?",
    answer:
      "Order actions stay visible, but checkout starts after login so orders can be tracked from your dashboard.",
  },
  {
    id: "f3",
    question: "Can I request custom bulk pricing?",
    answer:
      "Yes. Use the quote option to request tonnage pricing based on volume, route, and delivery timeline.",
  },
];
