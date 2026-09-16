"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { FiCheck, FiClipboard, FiCreditCard, FiImage, FiSend, FiTruck } from "react-icons/fi";
import Nav from "@/components/Nav/Nav";

const steps = [
  { icon: FiClipboard, title: "اختار المنتج", description: "اكتب اسم المنتج الذي تبحث عنه." },
  { icon: FiSend, title: "ابعت بياناتك", description: "أرسل اسمك ورقم هاتفك وصورة المنتج." },
  { icon: FiCreditCard, title: "نراجع طلبك", description: "نتواصل معك لتأكيد تفاصيل المنتج." },
  { icon: FiTruck, title: "يوصل لمصر", description: "نوصل المنتج لك داخل مصر." },
];

export default function PreOrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [productName, setProductName] = useState("");
  const [productImagePreview, setProductImagePreview] = useState("");
  const [productImageName, setProductImageName] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProductImagePreview(String(reader.result));
    reader.readAsDataURL(file);
    setProductImageName(file.name);
  };

  return (
    <>
      <Nav />
      <main dir="rtl" className="min-h-[calc(100vh-80px)] bg-[#f8f6f0] px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <section className="preorder-heading mb-12 text-center">
            <p className="text-sm font-bold tracking-[0.16em] text-amber-600">منتجاتك توصلك لمصر</p>
            <h1 className="mt-3 text-4xl font-bold text-green-950 sm:text-5xl">اطلب منتجك</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-500">
              ابعت اسم المنتج وصورته، وإحنا نوصله لك في مصر.
            </p>
          </section>

          <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} style={{ animationDelay: `${index * 160}ms` }} className="preorder-step rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-900 text-xl text-amber-300"><Icon /></span>
                    <span className="text-3xl font-bold text-green-950/10">{(index + 1).toLocaleString("ar-EG")}</span>
                  </div>
                  <h2 className="mt-6 font-bold text-green-950">{step.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{step.description}</p>
                </article>
              );
            })}
          </section>

          <section className="preorder-form mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(31,61,42,0.08)] sm:p-9">
            {submitted ? (
              <div className="py-10 text-center">
                <FiCheck className="mx-auto text-5xl text-green-700" />
                <h2 className="mt-5 text-2xl font-bold text-green-950">تم استلام طلبك المبدئي</h2>
                <p className="mt-3 leading-7 text-slate-500">فريقنا هيتواصل معك لتأكيد المنتج والعربون والتوصيل.</p>
                <Link href="/products" className="mt-6 inline-flex rounded-full bg-green-900 px-6 py-3 font-bold text-white">العودة للمنتجات</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-green-950">اطلب منتجك الآن</h2>
                  <p className="mt-2 text-sm text-slate-500">املأ البيانات وسنتواصل معك.</p>
                </div>
                <input required name="name" placeholder="الاسم بالكامل" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-right outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
                <input required name="phone" type="tel" placeholder="رقم الهاتف" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-right outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
                <input required name="product" value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="اسم المنتج الذي تبحث عنه" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-right outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
                <div className="rounded-2xl border border-dashed border-amber-400 bg-amber-50/70 p-3">
                  <input id="product-image" required name="productImage" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                  {productImagePreview ? (
                    <div className="space-y-3">
                      <div className="relative h-48 overflow-hidden rounded-xl bg-white">
                        <Image src={productImagePreview} alt="معاينة صورة المنتج" fill unoptimized className="object-cover" />
                      </div>
                      <div className="flex items-center justify-between gap-3 px-1">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-green-950">{productImageName}</p>
                          <p className="mt-1 text-xs text-green-800">تم اختيار صورة المنتج</p>
                        </div>
                        <label htmlFor="product-image" className="shrink-0 cursor-pointer rounded-full border border-green-900 px-4 py-2 text-xs font-bold text-green-900 transition hover:bg-green-900 hover:text-white">
                          تغيير الصورة
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="product-image" className="flex cursor-pointer items-center gap-4 rounded-xl bg-white p-4 transition hover:bg-amber-100">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-900 text-2xl text-amber-300"><FiImage /></span>
                      <span>
                        <span className="block font-bold text-green-950">أضف صورة المنتج</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">اضغط لاختيار صورة واضحة من جهازك</span>
                      </span>
                    </label>
                  )}
                </div>
                <textarea name="notes" placeholder="ملاحظات إضافية (اختياري)" rows={3} className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-right outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
                <button type="submit" className="w-full rounded-full bg-green-900 px-5 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-green-800">اطلب منتجك</button>
              </form>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
