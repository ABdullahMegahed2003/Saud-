import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products, total: products.length });
  } catch {
    return NextResponse.json({ error: "تعذر تحميل المنتجات" }, { status: 503 });
  }
}
