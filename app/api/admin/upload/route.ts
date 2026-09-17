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

    const removeBackgroundKey = process.env.REMOVE_BG_API_KEY;
    if (!removeBackgroundKey) {
      return NextResponse.json(
        { error: "إزالة الخلفية غير مفعلة: أضف REMOVE_BG_API_KEY في إعدادات Vercel" },
        { status: 503 },
      );
    }

    const removeBackgroundData = new FormData();
    removeBackgroundData.append("image_file", file);
    removeBackgroundData.append("size", "auto");
    removeBackgroundData.append("format", "png");

    const removeBackgroundResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": removeBackgroundKey },
      body: removeBackgroundData,
    });

    if (!removeBackgroundResponse.ok) {
      const removeBackgroundError = await removeBackgroundResponse.text();
      return NextResponse.json(
        { error: `تعذر إزالة الخلفية: ${removeBackgroundError.slice(0, 180)}` },
        { status: 502 },
      );
    }

    const transparentImage = await removeBackgroundResponse.blob();

    const fileName = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}.png`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(fileName, transparentImage, {
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
    const { error: bucketError } = await supabase.storage.createBucket("product-images", {
      public: true,
    });

    if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) {
      return NextResponse.json(
        { error: "تعذر إنشاء مساحة الصور في Supabase: تحقق من مفتاح الخدمة" },
        { status: 503 },
      );
    }

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, await transparentImage.arrayBuffer(), {
        contentType: "image/png",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    const errorText = message.includes("bucket")
      ? "مساحة الصور غير جاهزة في Supabase. شغّل ملف supabase/products.sql أو تأكد من مفتاح الخدمة."
      : "تعذر رفع الصورة. تأكد أن إعدادات Supabase موجودة في Vercel وأن حجم الصورة أقل من 5 ميجابايت.";

    return NextResponse.json({ error: errorText }, { status: 500 });
  }
}