import { put } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const adminPassword = process.env.ADMIN_PASSWORD || "102030";

export async function POST(request: Request) {
  if (request.headers.get("x-admin-password") !== adminPassword) {
    return NextResponse.json({ error: "الرقم السري غير صحيح" }, { status: 401 });
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

    const fileName = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(fileName, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return NextResponse.json({ url: blob.url });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "أضف إعدادات Supabase أو BLOB_READ_WRITE_TOKEN في Vercel" },
        { status: 503 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return NextResponse.json({ url: data.publicUrl });
  } catch {
    return NextResponse.json({ error: "تعذر رفع الصورة" }, { status: 500 });
  }
}