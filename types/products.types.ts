export type ProductAvailability = "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface ProductCategory {
  id: string;
  title: string;
  description: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  image: string | null;
  maizeType: string;
  packagingSize: string;
  pricePerBag: string;
  pricePerTon: string;
  availability: ProductAvailability;
  minOrder: string;
  summary: string;
}

export interface ProductFaq {
  id: string;
  question: string;
  answer: string;
}
