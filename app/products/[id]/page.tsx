import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight, FiCheck, FiClock } from "react-icons/fi";
import { getAllProducts } from "@/lib/products";
import ProductDetailsControls from "@/components/Product/ProductDetails";
import Nav from "@/components/Nav/Nav";

export const dynamic = "force-dynamic";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await getAllProducts();
  const product = products.find((item) => item.id === Number(id));

  if (!product) notFound();

  const isAvailable = product.status === "available";

  return (
    <>
      <Nav />
      <main dir="rtl" className="min-h-screen bg-[#f8f6f0] px-5 py-7 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-green-900 transition hover:gap-3"
        >
          <FiArrowRight /> العودة للمنتجات
        </Link>

        <section className="grid overflow-hidden rounded-3xl border border-green-950/10 bg-white shadow-[0_14px_36px_rgba(31,61,42,0.1)] lg:grid-cols-2">
          <div className="relative min-h-62.5 bg-green-50 lg:min-h-107.5">
            <Image
              data-product-image
              src={product.image || "/images/Hero Section.png"}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-8">
            <span
              className={`mb-5 flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                isAvailable ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-800"
              }`}
            >
              {isAvailable ? <FiCheck /> : <FiClock />}
              {isAvailable ? "متوفر الآن" : "طلب مسبق"}
            </span>
            <p className="text-sm font-bold tracking-[0.16em] text-amber-600">تفاصيل المنتج</p>
            <h1 className="mt-3 text-3xl font-bold text-green-950 sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-base leading-7 text-slate-500">{product.description}</p>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-400">السعر</p>
              <p className="mt-1 text-3xl font-bold text-amber-600">
                {product.price} <span className="text-base">ج.م</span>
              </p>
            </div>
            <ProductDetailsControls productId={product.id} isAvailable={isAvailable} />
          </div>
        </section>
      </div>
      </main>
    </>
  );
}
