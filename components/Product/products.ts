import productData from "@/data/products.json";

export type ProductStatus = "available" | "preorder";

export type ProductItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  image?: string;
  featured?: boolean;
};

export const products = productData as ProductItem[];
