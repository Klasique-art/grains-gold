export interface HomeHeroStat {
  id: string;
  label: string;
  value: string;
}

export interface HomeBenefit {
  id: string;
  title: string;
  description: string;
}

export interface HomeProductPreview {
  id: string;
  name: string;
  packaging: string;
  pricePerBag: string;
  pricePerTon: string;
  availability: "Available" | "Low Stock" | "Out of Stock";
  summary: string;
}

export interface HomeStep {
  id: string;
  title: string;
  description: string;
}

export interface HomeTestimonial {
  id: string;
  customerName: string;
  role: string;
  quote: string;
}

export interface HomeAnnouncement {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  href: string;
}

