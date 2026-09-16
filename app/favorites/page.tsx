"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import Nav from "@/components/Nav/Nav";
import { products } from "@/components/Product/products";
import { readFavoriteIds, saveFavoriteIds } from "@/components/Product/browserStorage";

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const sync = () => setFavoriteIds(readFavoriteIds());
    sync();
    window.addEventListener("saudi-storage-change", sync);
    return () => window.removeEventListener("saudi-storage-change", sync);
  }, []);

  const favorites = products.filter((product) => favoriteIds.includes(product.id));

  const removeFavorite = (id: number) => {
    const nextIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
    setFavoriteIds(nextIds);
    saveFavoriteIds(nextIds);
  };

  return (
    <>
      <Nav />
      <main dir="rtl" className="min-h-[calc(100vh-80px)] bg-[#f8f6f0] px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-3">
            <FiHeart className="text-3xl text-red-600" />
            <div>
              <p className="text-sm font-bold text-amber-600">اختياراتك المحفوظة</p>
              <h1 className="text-4xl font-bold text-green-950">المفضلة</h1>
            </div>
          </div>

          {favorites.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <Image src="/images/Hero Section.png" alt={product.name} width={600} height={320} className="h-40 w-full object-cover" />
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-green-950">{product.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">{product.price} ج.م</p>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <Link href={`/products/${product.id}`} className="rounded-full bg-green-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-800">تفاصيل المنتج</Link>
                      <button type="button" onClick={() => removeFavorite(product.id)} aria-label="إزالة من المفضلة" className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 text-red-500 transition hover:bg-red-50"><FiTrash2 /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
              <FiHeart className="mx-auto text-5xl text-red-200" />
              <h2 className="mt-5 text-2xl font-bold text-green-950">المفضلة لسه فاضية</h2>
              <p className="mt-2 text-slate-500">اضغط على القلب في تفاصيل أي منتج لحفظه هنا.</p>
              <Link href="/products" className="mt-6 inline-flex rounded-full bg-green-900 px-6 py-3 font-bold text-white">تصفح المنتجات</Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
