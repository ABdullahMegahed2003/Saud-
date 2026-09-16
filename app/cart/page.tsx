"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import Nav from "@/components/Nav/Nav";
import { products } from "@/components/Product/products";
import { readCart, saveCart } from "@/components/Product/browserStorage";

export default function CartPage() {
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    const sync = () => setCart(readCart());
    sync();
    window.addEventListener("saudi-storage-change", sync);
    return () => window.removeEventListener("saudi-storage-change", sync);
  }, []);

  const items = useMemo(
    () => products.filter((product) => cart[String(product.id)]),
    [cart],
  );
  const total = items.reduce((sum, product) => sum + product.price * cart[String(product.id)], 0);

  const updateQuantity = (id: number, quantity: number) => {
    const nextCart = { ...cart };
    if (quantity < 1) delete nextCart[String(id)];
    else nextCart[String(id)] = quantity;
    setCart(nextCart);
    saveCart(nextCart);
  };

  return (
    <>
      <Nav />
      <main dir="rtl" className="min-h-[calc(100vh-80px)] bg-[#f8f6f0] px-3 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-center gap-3 sm:mb-10">
            <FiShoppingCart className="text-2xl text-green-900 sm:text-3xl" />
            <div>
              <p className="text-sm font-bold text-amber-600">مراجعة اختياراتك</p>
              <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">سلة المنتجات</h1>
            </div>
          </div>

          {items.length ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              <div className="space-y-3">
                {items.map((product) => (
                  <article key={product.id} className="rounded-xl bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex sm:items-center sm:gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Image src="/images/Hero Section.png" alt={product.name} width={80} height={64} className="h-16 w-20 shrink-0 rounded-lg object-cover sm:h-20 sm:w-24" />
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${product.id}`} className="block truncate text-sm font-bold text-green-950 hover:text-green-700 sm:text-base">{product.name}</Link>
                      <p className="mt-1 text-sm font-bold text-amber-600">{product.price} ج.م</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 sm:mt-0 sm:justify-end sm:border-0 sm:pt-0">
                      <span className="text-xs text-slate-400 sm:hidden">الكمية</span>
                      <div className="flex shrink-0 items-center gap-2">
                      <div className="flex items-center overflow-hidden rounded-full border border-green-900/20">
                        <button type="button" onClick={() => updateQuantity(product.id, cart[String(product.id)] - 1)} aria-label="تقليل الكمية" className="flex h-8 w-8 items-center justify-center text-sm text-green-900 hover:bg-green-50"><FiMinus /></button>
                        <span className="flex h-8 min-w-8 items-center justify-center border-x border-green-900/10 text-sm font-bold">{cart[String(product.id)]}</span>
                        <button type="button" onClick={() => updateQuantity(product.id, cart[String(product.id)] + 1)} aria-label="زيادة الكمية" className="flex h-8 w-8 items-center justify-center text-sm text-green-900 hover:bg-green-50"><FiPlus /></button>
                      </div>
                      <button type="button" onClick={() => updateQuantity(product.id, 0)} aria-label="حذف المنتج" className="text-sm text-red-500 transition hover:scale-110"><FiTrash2 /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-2xl bg-green-950 p-6 text-white shadow-lg">
                <h2 className="text-xl font-bold">ملخص الطلب</h2>
                <div className="mt-6 flex items-center justify-between border-b border-white/20 pb-4 text-sm text-white/70"><span>عدد المنتجات</span><span>{items.reduce((sum, product) => sum + cart[String(product.id)], 0)}</span></div>
                <div className="mt-5 flex items-center justify-between text-lg font-bold"><span>الإجمالي</span><span className="text-amber-300">{total} ج.م</span></div>
                <button type="button" className="mt-6 w-full rounded-full bg-amber-400 px-5 py-3 font-bold text-green-950 transition hover:bg-amber-300">إتمام الطلب</button>
              </aside>
            </div>
          ) : (
            <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
              <FiShoppingCart className="mx-auto text-5xl text-green-200" />
              <h2 className="mt-5 text-2xl font-bold text-green-950">السلة لسه فاضية</h2>
              <p className="mt-2 text-slate-500">أضف المنتجات التي تريدها وستظهر هنا.</p>
              <Link href="/products" className="mt-6 inline-flex rounded-full bg-green-900 px-6 py-3 font-bold text-white">تصفح المنتجات</Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
