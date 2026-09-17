"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiClock, FiSearch, FiShoppingBag } from "react-icons/fi";
import { products, type ProductStatus } from "./products";

type Filter = "all" | ProductStatus;

const statusDetails = {
  available: { label: "متوفر الآن", icon: FiCheck },
  preorder: { label: "طلب مسبق", icon: FiClock },
};

export default function Product({
  featured = false,
  initialFilter = "all",
}: {
  featured?: boolean;
  initialFilter?: Filter;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [catalog, setCatalog] = useState(products);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Products API unavailable");
        return response.json();
      })
      .then((data: { products?: typeof products }) => {
        if (data.products?.length) setCatalog(data.products);
      })
      .catch(() => undefined);
  }, [featured]);

  const filteredProducts = useMemo(() => {
    if (featured) return catalog.filter((product) => product.featured === true).slice(0, 8);

    const normalizedQuery = query.trim().toLowerCase();

    return catalog.filter((product) => {
      const matchesFilter = filter === "all" || product.status === filter;
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [catalog, featured, filter, query]);

  return (
    <main
      ref={sectionRef}
      dir="rtl"
      className={`products-section ${featured ? "bg-[#f8f6f0] px-5 py-12 sm:px-8 lg:px-16" : "min-h-screen bg-[#f8f6f0] px-5 py-12 sm:px-8 lg:px-16"} ${isVisible ? "is-visible" : ""}`}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-bold tracking-[0.16em] text-amber-600">
              اختيارات أصلية من السعودية
            </p>
            <h1 className="text-4xl font-bold text-green-950 sm:text-5xl">
              {featured ? "منتجات مختارة ليك" : "متجر سعودي عندك"}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-500">
              {featured
                ? "اختار من منتجاتنا المميزة وشوف باقي التشكيلة في المتجر."
                : "اختار منتجك المفضل، وشوف المتاح الآن أو احجزه بطلب مسبق."}
            </p>
          </div>

          {!featured && (
            <div className="relative w-full lg:max-w-sm">
              <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث عن منتج..."
                aria-label="البحث عن منتج"
                className="w-full rounded-2xl border border-green-950/10 bg-white py-4 pl-4 pr-12 text-right text-sm text-slate-700 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </div>
          )}
        </header>

        {!featured && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="ml-2 text-sm font-bold text-slate-500">فلترة:</span>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="rounded-full bg-green-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-900/20"
            >
              كل المنتجات
            </button>
            <button
              type="button"
              onClick={() => setFilter("available")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${filter === "available" ? "bg-green-900 text-white" : "bg-white text-slate-600"}`}
            >
              متوفر الآن
            </button>
            <button
              type="button"
              onClick={() => setFilter("preorder")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${filter === "preorder" ? "bg-amber-400 text-green-950" : "bg-white text-slate-600"}`}
            >
              طلب مسبق
            </button>
            <span className="mr-auto text-sm text-slate-400">{filteredProducts.length} منتجات</span>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <>
            <div className={featured ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
            {filteredProducts.map((product, index) => {
              const status = statusDetails[product.status];
              const StatusIcon = status.icon;

              return (
                <article
                  key={product.id}
                  className={`product-card group overflow-hidden border border-green-950/10 bg-white shadow-[0_12px_30px_rgba(31,61,42,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_42px_rgba(31,61,42,0.14)] ${featured ? "rounded-xl" : "rounded-2xl"}`}
                  style={{ animationDelay: `${index * 120}ms, ${900 + index * 120}ms` }}
                >
                  <div className={`relative overflow-hidden bg-green-50 ${featured ? "h-32" : "h-44"}`}>
                    <Image
                      src={product.image || "/images/Hero Section.png"}
                      alt={product.name}
                      fill
                      sizes={featured ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                      className="object-contain p-3 transition duration-700"
                    />
                    <span
                      className={`absolute flex items-center gap-1.5 rounded-full font-bold shadow-sm ${featured ? "right-2 top-2 px-2 py-1 text-[10px]" : "right-4 top-4 px-3 py-1.5 text-xs"} ${
                        product.status === "available"
                          ? "bg-green-900 text-white"
                          : "bg-amber-400 text-green-950"
                      }`}
                    >
                      <StatusIcon />
                      {status.label}
                    </span>
                  </div>

                  <div className={featured ? "p-3" : "p-4"}>
                    <h2 className={`${featured ? "text-sm" : "text-lg"} font-bold text-green-950`}>{product.name}</h2>
                    <p className={`${featured ? "mt-1 min-h-10 text-xs leading-5" : "mt-2 min-h-12 text-sm leading-6"} text-slate-500`}>{product.description}</p>
                    <div className={`${featured ? "mt-3 pt-3" : "mt-4 pt-4"} flex items-center justify-between gap-2 border-t border-slate-100`}>
                      <p className={`${featured ? "text-base" : "text-lg"} font-bold text-amber-600`}>
                        {product.price} <span className={featured ? "text-xs" : "text-sm"}>ج.م</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className={`rounded-full border border-green-900 font-bold text-green-900 transition-all duration-300 hover:bg-green-900 hover:text-white ${featured ? "px-2 py-1.5 text-[10px]" : "px-3 py-2 text-xs"}`}
                        >
                          تفاصيل المنتج
                        </Link>
                        <button
                          type="button"
                          aria-label={`إضافة ${product.name} إلى السلة`}
                          className={`flex items-center justify-center rounded-full bg-green-900 text-white transition-all duration-300 hover:rotate-[-8deg] hover:bg-green-800 ${featured ? "h-8 w-8 text-base" : "h-10 w-10 text-lg"}`}
                        >
                          <FiShoppingBag />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
            {featured && (
              <div className="mt-10 text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-full bg-green-900 px-7 py-3 font-bold text-white shadow-lg shadow-green-900/20 transition duration-300 hover:-translate-y-1 hover:bg-green-800"
                >
                  عرض المزيد
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[1.5rem] bg-white px-6 py-20 text-center shadow-sm">
            <FiSearch className="mx-auto text-4xl text-amber-500" />
            <h2 className="mt-5 text-2xl font-bold text-green-950">مش لقينا المنتج ده</h2>
            <p className="mt-2 text-slate-500">جرّب كلمة بحث مختلفة أو اعرض كل المنتجات.</p>
          </div>
        )}
      </div>
    </main>
  );
}
