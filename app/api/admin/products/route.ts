import { NextResponse } from "next/server";
import { addCustomProduct, hasPersistentStorage, isValidProductStatus } from "@/lib/products";

const adminPassword = process.env.ADMIN_PASSWORD || "102030";

export async function POST(request: Request) {
  if (request.headers.get("x-admin-password") !== adminPassword) {
    return NextResponse.json({ error: "الرقم السري غير صحيح" }, { status: 401 });
  }

  if (!hasPersistentStorage()) {
    return NextResponse.json(
      { error: "لم يتم إعداد قاعدة البيانات الدائمة على Vercel بعد" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const image = typeof body.image === "string" ? body.image.trim() : "";
    const price = Number(body.price);
    const status = body.status;

    if (!name || !description || !Number.isFinite(price) || price <= 0 || !isValidProductStatus(status)) {
      return NextResponse.json({ error: "راجع بيانات المنتج" }, { status: 400 });
    }

    const product = await addCustomProduct({
      name,
      description,
      price,
      status,
      ...(image ? { image } : {}),
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر حفظ المنتج" }, { status: 500 });
  }
}