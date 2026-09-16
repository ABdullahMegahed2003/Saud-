import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    const response = await fetch(API_URL, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return NextResponse.json({ error: "تعذر تحميل المنتجات" }, { status: response.status });
    }

    const data = await response.json();
    const products = data.products.map((product: {
      id: number;
      title: string;
      description: string;
      price: number;
      thumbnail: string;
      stock: number;
      category: string;
    }) => ({
      id: product.id,
      name: `${categoryNames[product.category] || "منتج سعودي"} ${product.id}`,
      description: "منتج مختار بعناية بجودة عالية، متاح للطلب والتوصيل حتى باب البيت.",
      price: Math.round(product.price * 50),
      image: product.thumbnail,
      status: product.id % 5 === 0 ? "preorder" : "available",
    }));

    return NextResponse.json({ products, total: products.length });
  } catch {
    return NextResponse.json({ error: "تعذر الاتصال بمصدر المنتجات" }, { status: 503 });
  }
}
