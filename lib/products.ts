import { Redis } from "@upstash/redis";
import { products as seedProducts, type ProductItem, type ProductStatus } from "@/components/Product/products";

const PRODUCTS_KEY = "saudi:products";
const API_URL = "https://dummyjson.com/products?limit=100";

const categoryNames: Record<string, string> = {
  beauty: "منتج عناية وجمال",
  fragrances: "عطر سعودي",
  furniture: "قطعة منزلية",
  groceries: "منتج غذائي",
  "home-decoration": "ديكور منزلي",
  tops: "زي أنيق",
  automotive: "منتج سيارات",
  motorcycle: "ملحق دراجات",
  laptops: "جهاز إلكتروني",
  smartphones: "هاتف ذكي",
  tablets: "جهاز لوحي",
  "mens-shirts": "ملابس رجالية",
  "mens-shoes": "حذاء رجالي",
  "mens-watches": "ساعة رجالية",
  "womens-dresses": "ملابس نسائية",
  "womens-shoes": "حذاء نسائي",
  "womens-watches": "ساعة نسائية",
  "womens-bags": "حقيبة نسائية",
  sunglasses: "نظارة شمسية",
  "skin-care": "عناية بالبشرة",
  "kitchen-accessories": "أدوات مطبخ",
};

type DummyProduct = {
  id: number;
  price: number;
  thumbnail: string;
  category: string;
};

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  return url && token ? new Redis({ url, token }) : null;
}

export function hasPersistentStorage() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export async function getCustomProducts(): Promise<ProductItem[]> {
  const redis = getRedis();
  if (!redis) return [];

  const savedProducts = await redis.get<ProductItem[]>(PRODUCTS_KEY);
  return Array.isArray(savedProducts) ? savedProducts : [];
}

export async function addCustomProduct(product: Omit<ProductItem, "id">) {
  const redis = getRedis();
  if (!redis) throw new Error("Persistent storage is not configured");

  const currentProducts = await getCustomProducts();
  const newProduct: ProductItem = {
    ...product,
    id: Date.now(),
  };

  await redis.set(PRODUCTS_KEY, [...currentProducts, newProduct]);
  return newProduct;
}

async function getRemoteProducts(): Promise<ProductItem[]> {
  const response = await fetch(API_URL, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error("Remote products unavailable");

  const data = await response.json() as { products: DummyProduct[] };
  return data.products.map((product) => ({
    id: product.id,
    name: `${categoryNames[product.category] || "منتج سعودي"} ${product.id}`,
    description: "منتج مختار بعناية بجودة عالية، متاح للطلب والتوصيل حتى باب البيت.",
    price: Math.round(product.price * 50),
    image: product.thumbnail,
    status: product.id % 5 === 0 ? "preorder" : "available",
  }));
}

export async function getAllProducts(): Promise<ProductItem[]> {
  const [remoteProducts, customProducts] = await Promise.all([
    getRemoteProducts().catch(() => seedProducts),
    getCustomProducts(),
  ]);

  return [...customProducts, ...remoteProducts];
}

export function isValidProductStatus(status: unknown): status is ProductStatus {
  return status === "available" || status === "preorder";
}
