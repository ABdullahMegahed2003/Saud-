import { createClient } from "@supabase/supabase-js";
import { products as seedProducts, type ProductItem, type ProductStatus } from "@/components/Product/products";

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

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  return url && serviceRoleKey ? createClient(url, serviceRoleKey) : null;
}

export function hasPersistentStorage() {
  return Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
  );
}

export async function getCustomProducts(): Promise<ProductItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, status, image")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ProductItem[];
}

export async function addCustomProduct(product: Omit<ProductItem, "id">) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Persistent storage is not configured");

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select("id, name, description, price, status, image")
    .single();

  if (error) throw error;
  return data as ProductItem;
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
