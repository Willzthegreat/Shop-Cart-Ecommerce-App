export interface Category {
  _id: string;
  title: string;
  slug: string;
}

export interface Brand {
  _id: string;
  title: string;
  slug: string;
}

export interface Product {
  discount?: number;
  code?: string;
  _id: string;
  name: string;
  slug: string;
  description?: string;

  price: number;
  originalPrice?: number;

  images: string[];

  category?: string | Category;
  brand?: string | Brand;

  stock?: number;

  status?: "new" | "sale" | "featured";
}
