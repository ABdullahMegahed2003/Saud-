"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import type { ProductItem } from "@/components/Product/products";

const initialForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  status: "available",
};

export default function AdminProductForm() {
  const [password, setPassword] = useState("");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [adminProducts, setAdminProducts] = useState<ProductItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCheckingPassword(true);
    setMessage("");

    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setIsCheckingPassword(false);
    if (!response.ok) {
      setMessage("الرقم السري غير صحيح");
      return;
    }

    setIsAuthenticated(true);
    await loadProducts(password);
  }

  async function loadProducts(adminKey = password) {
    const response = await fetch("/api/admin/products", { headers: { "x-admin-password": adminKey } });
    const data = await response.json() as { products?: ProductItem[]; error?: string };
    if (response.ok) setAdminProducts(data.products || []);
    else setMessage(data.error || "تعذر تحميل المنتجات");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const selectedFile = fileInputRef.current?.files?.[0];
    let image = form.image;

    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);
      const uploadResponse = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: uploadData,
      });
      const uploadResult = await uploadResponse.json() as { error?: string; url?: string };

      if (!uploadResponse.ok || !uploadResult.url) {
        setIsSaving(false);
        setMessage(uploadResult.error || "تعذر رفع الصورة");
        return;
      }

      image = uploadResult.url;
    }

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ ...form, image, price: Number(form.price), ...(editingId ? { id: editingId } : {}) }),
    });
    const data = await response.json() as { error?: string; product?: ProductItem };

    setIsSaving(false);
    if (!response.ok) {
      setMessage(data.error || "تعذر حفظ المنتج");
      return;
    }

    setForm(initialForm);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    await loadProducts();
    setMessage(editingId ? "تم تعديل المنتج بنجاح." : "تمت إضافة المنتج، وسيظهر الآن لكل الزوار.");
  }

  function startEditing(product: ProductItem) {
    setEditingId(product.id);
    setForm({ name: product.name, description: product.description, price: String(product.price), image: product.image || "", status: product.status });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("هل تريد حذف هذا المنتج؟")) return;
    const response = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id }),
    });
    const data = await response.json() as { error?: string };
    if (!response.ok) {
      setMessage(data.error || "تعذر حذف المنتج");
      return;
    }
    if (editingId === id) {
      setEditingId(null);
      setForm(initialForm);
    }
    await loadProducts();
    setMessage("تم حذف المنتج.");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8f6f0] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-bold text-green-900">العودة للموقع</Link>
        <section className="mt-6 rounded-3xl border border-green-950/10 bg-white p-6 shadow-[0_14px_36px_rgba(31,61,42,0.1)] sm:p-10">
          <p className="text-sm font-bold tracking-[0.16em] text-amber-600">لوحة التحكم</p>
          <h1 className="mt-3 text-3xl font-bold text-green-950">{isAuthenticated ? (editingId ? "تعديل المنتج" : "إضافة منتج جديد") : "دخول لوحة التحكم"}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">{isAuthenticated ? "المنتج المحفوظ سيظهر تلقائيًا في المتجر على كل الأجهزة." : "أدخل الرقم السري للمتابعة."}</p>

          {!isAuthenticated ? (
            <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-5">
              <label className="block text-sm font-bold text-slate-700">الرقم السري
                <input autoFocus required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="admin-input" />
              </label>
              <button disabled={isCheckingPassword} className="w-full rounded-full bg-green-900 px-5 py-3 font-bold text-white transition hover:bg-green-800 disabled:cursor-wait disabled:opacity-60">
                {isCheckingPassword ? "جارٍ التحقق..." : "دخول"}
              </button>
              {message && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{message}</p>}
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-bold text-slate-700">اسم المنتج
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="admin-input" />
            </label>
            <label className="block text-sm font-bold text-slate-700">الوصف
              <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="admin-input min-h-28" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold text-slate-700">السعر بالجنيه
                <input required min="1" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="admin-input" />
              </label>
              <label className="block text-sm font-bold text-slate-700">الحالة
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="admin-input">
                  <option value="available">متوفر الآن</option>
                  <option value="preorder">طلب مسبق</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-bold text-slate-700">صورة المنتج (اختياري)
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="admin-input file:ml-4 file:rounded-full file:border-0 file:bg-green-900 file:px-4 file:py-2 file:font-bold file:text-white" />
            </label>
            <label className="block text-sm font-bold text-slate-700">أو رابط الصورة (اختياري)
              <input type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://..." className="admin-input" />
            </label>
            <button disabled={isSaving} className="w-full rounded-full bg-green-900 px-5 py-3 font-bold text-white transition hover:bg-green-800 disabled:cursor-wait disabled:opacity-60">
              {isSaving ? "جارٍ الحفظ..." : editingId ? "حفظ التعديل" : "حفظ المنتج"}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="w-full rounded-full border border-green-900 px-5 py-3 font-bold text-green-900">إلغاء التعديل</button>}
            {message && <p role="status" className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">{message}</p>}
          </form>
          )}
        </section>

        {isAuthenticated && (
          <section className="mt-6 rounded-3xl border border-green-950/10 bg-white p-6 shadow-[0_14px_36px_rgba(31,61,42,0.1)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-green-950">منتجاتي</h2>
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">العدد: {adminProducts.length}</span>
            </div>
            {adminProducts.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">لا توجد منتجات مضافة من لوحة التحكم بعد.</p>
            ) : (
              <div className="mt-6 space-y-3">
                {adminProducts.map((product) => (
                  <div key={product.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      {product.image && <Image src={product.image} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />}
                      <div><h3 className="font-bold text-green-950">{product.name}</h3><p className="text-sm text-slate-500">{product.price} ج.م</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEditing(product)} className="rounded-full bg-green-900 px-4 py-2 text-sm font-bold text-white">تعديل</button>
                      <button type="button" onClick={() => handleDelete(product.id)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700">حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}