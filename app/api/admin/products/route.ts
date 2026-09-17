import { NextResponse } from "next/server";
import { addCustomProduct, deleteCustomProduct, getCustomProducts, hasPersistentStorage, isValidProductStatus, updateCustomProduct } from "@/lib/products";

const adminPassword = process.env.ADMIN_PASSWORD || "102030";

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "الرقم السري غير صحيح" }, { status: 401 });
  try {
    const products = await getCustomProducts();
    return NextResponse.json({ products, total: products.length });
  } catch (error) {
    return NextResponse.json({ error: `تعذر تحميل المنتجات: ${getErrorMessage(error)}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "الرقم السري غير صحيح" }, { status: 401 });
  }

  return saveProduct(request, false);
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "الرقم السري غير صحيح" }, { status: 401 });
  return saveProduct(request, true);
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "الرقم السري غير صحيح" }, { status: 401 });
  try {
    const { id } = await request.json() as { id?: unknown };
    const productId = Number(id);
    if (!Number.isInteger(productId)) return NextResponse.json({ error: "معرف المنتج غير صحيح" }, { status: 400 });
    await deleteCustomProduct(productId);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json({ error: `تعذر حذف المنتج: ${getErrorMessage(error)}` }, { status: 500 });
  }
}

async function saveProduct(request: Request, isUpdate: boolean) {
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
    const featured = body.featured === true;
    const productId = Number(body.id);

    if (!name || !description || !Number.isFinite(price) || price <= 0 || !isValidProductStatus(status)) {
      return NextResponse.json({ error: "راجع بيانات المنتج" }, { status: 400 });
    }

    const productData = {
      name,
      description,
      price,
      status,
      featured,
      ...(image ? { image } : {}),
    } as Parameters<typeof addCustomProduct>[0];
    const product = isUpdate
      ? await updateCustomProduct(productId, productData)
      : await addCustomProduct(productData);

    return NextResponse.json({ product }, { status: isUpdate ? 200 : 201 });
  } catch (error) {
    const databaseError = getErrorMessage(error);
    return NextResponse.json({ error: `تعذر حفظ المنتج: ${databaseError}` }, { status: 500 });
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const details = error as { message?: string; code?: string; details?: string; hint?: string };
    return [details.message, details.code && `code: ${details.code}`, details.details, details.hint]
      .filter(Boolean)
      .join(" | ") || JSON.stringify(error);
  }

  return String(error);
}

function isAuthorized(request: Request) {
  return request.headers.get("x-admin-password") === adminPassword;
}