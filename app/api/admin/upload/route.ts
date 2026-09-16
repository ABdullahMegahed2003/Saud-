import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const adminPassword = process.env.ADMIN_PASSWORD || "102030";

export async function POST(request: Request) {
  if (request.headers.get("x-admin-password") !== adminPassword) {
    return NextResponse.json({ error: "الرقم السري غير صحيح" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "رفع الصور غير مفعل: أضف BLOB_READ_WRITE_TOKEN في إعدادات Vercel" },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "اختار ملف صورة صحيح" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت" }, { status: 400 });
    }

    const blob = await put(`products/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: "تعذر رفع الصورة" }, { status: 500 });
  }
}