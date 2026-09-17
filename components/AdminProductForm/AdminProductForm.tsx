"use client";

import Link from "next/link";
import Image from "next/image";
import { FiBox, FiCheckCircle, FiEdit3, FiImage, FiLogOut, FiPlus, FiTrash2 } from "react-icons/fi";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { ProductItem } from "@/components/Product/products";

const initialForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  status: "available",
};

type AdminMode = "dashboard" | "create" | "manage";

export default function AdminProductForm({ mode = "dashboard" }: { mode?: AdminMode }) {
  const [password, setPassword] = useState("");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [adminProducts, setAdminProducts] = useState<ProductItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    await loadProducts();
    setMessage(editingId ? "تم تعديل المنتج بنجاح." : "تمت إضافة المنتج، وسيظهر الآن لكل الزوار.");
  }

  function handleFileChange(file?: File) {
    if (!file) return;
    setImagePreview((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  function startEditing(product: ProductItem) {
    setEditingId(product.id);
    setForm({ name: product.name, description: product.description, price: String(product.price), image: product.image || "", status: product.status });
    setImagePreview(product.image || "");
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
      setImagePreview("");
    }
    await loadProducts();
    setMessage("تم حذف المنتج.");
  }

  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#eef2ed] px-5 py-10">
        <section className="w-full max-w-md rounded-[2rem] border border-green-950/10 bg-white p-8 shadow-[0_24px_70px_rgba(31,61,42,0.12)]">
          <Link href="/" className="text-sm font-bold text-green-900">العودة للموقع</Link>
          <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-900 text-2xl text-amber-300"><FiBox /></div>
          <p className="mt-7 text-sm font-bold text-amber-600">سعودي عندك / الإدارة</p>
          <h1 className="mt-2 text-3xl font-bold text-green-950">دخول لوحة التحكم</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">أدخل الرقم السري لإدارة المنتجات والصور.</p>
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-bold text-slate-700">الرقم السري
              <input autoFocus required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="admin-input" />
            </label>
            <button disabled={isCheckingPassword} className="w-full rounded-xl bg-green-900 px-5 py-3 font-bold text-white transition hover:bg-green-800 disabled:opacity-60">
              {isCheckingPassword ? "جارٍ التحقق..." : "دخول آمن"}
            </button>
            {message && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{message}</p>}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#eef2ed] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-green-950/10 bg-green-950 p-5 text-white lg:sticky lg:right-0 lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-l lg:p-7">
          <div className="flex items-center justify-between lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300 text-xl text-green-950"><FiBox /></div>
              <div><p className="font-bold">سعودي عندك</p><p className="text-xs text-white/50">لوحة الإدارة</p></div>
            </div>
            <Link href="/" className="text-sm text-white/60 transition hover:text-amber-300">الموقع ↗</Link>
          </div>
          <nav className="mt-8 hidden space-y-2 lg:block">
            <Link href="/admin" className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition ${mode === "dashboard" ? "bg-white/10 text-amber-300" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><FiBox /> نظرة عامة</Link>
            <Link href="/admin/products/new" className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition ${mode === "create" ? "bg-white/10 text-amber-300" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><FiPlus /> إضافة منتج</Link>
            <Link href="/admin/products/edit" className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition ${mode === "manage" ? "bg-white/10 text-amber-300" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><FiEdit3 /> تعديل المنتجات</Link>
          </nav>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-white/60">إجمالي المنتجات</p>
            <p className="mt-2 text-4xl font-bold text-amber-300">{adminProducts.length}</p>
            <p className="mt-2 text-xs text-white/50">منتجات مضافة من لوحة التحكم</p>
          </div>
          <div className="mt-6 hidden items-center gap-2 text-xs text-green-200 lg:flex"><FiCheckCircle /> البيانات متزامنة</div>
          <button type="button" onClick={() => { setIsAuthenticated(false); setPassword(""); }} className="mt-8 hidden items-center gap-2 text-sm text-white/60 transition hover:text-red-300 lg:flex"><FiLogOut /> تسجيل الخروج</button>
        </aside>

        <section className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
          <header className="mb-8 flex flex-col gap-4 border-b border-green-950/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-bold text-amber-600">إدارة الكتالوج</p><h1 className="mt-2 text-3xl font-bold text-green-950">{mode === "manage" ? (editingId ? "تعديل المنتج" : "تعديل المنتجات") : mode === "create" ? "إضافة منتج" : "نظرة عامة"}</h1><p className="mt-2 text-sm text-slate-500">{mode === "manage" ? "اختر منتجًا لتعديله أو حذفه." : mode === "create" ? "أضف منتجًا جديدًا ليظهر في المتجر." : "تابع منتجاتك وإدارة الكتالوج من هنا."}</p></div>
            {mode !== "create" && <Link href="/admin/products/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-green-950 transition hover:bg-amber-400"><FiPlus /> منتج جديد</Link>}
          </header>

          {(mode !== "manage" || editingId) && <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="rounded-2xl border border-green-950/10 bg-white p-6 shadow-sm sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block text-sm font-bold text-slate-700">اسم المنتج<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="admin-input" /></label>
                <label className="block text-sm font-bold text-slate-700">الوصف<textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="admin-input min-h-32" /></label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-bold text-slate-700">السعر بالجنيه<input required min="1" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="admin-input" /></label>
                  <label className="block text-sm font-bold text-slate-700">الحالة<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="admin-input"><option value="available">متوفر الآن</option><option value="preorder">طلب مسبق</option></select></label>
                </div>
                <label className="block text-sm font-bold text-slate-700">رفع صورة<input ref={fileInputRef} onChange={(event) => handleFileChange(event.target.files?.[0])} type="file" accept="image/png,image/jpeg,image/webp" className="admin-input file:ml-4 file:rounded-lg file:border-0 file:bg-green-900 file:px-4 file:py-2 file:font-bold file:text-white" /></label>
                <label className="block text-sm font-bold text-slate-700">رابط صورة بديل<input type="url" value={form.image} onChange={(event) => { setForm({ ...form, image: event.target.value }); setImagePreview(event.target.value); }} placeholder="https://..." className="admin-input" /></label>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button disabled={isSaving} className="flex-1 rounded-xl bg-green-900 px-5 py-3 font-bold text-white transition hover:bg-green-800 disabled:opacity-60">{isSaving ? "جارٍ الحفظ..." : editingId ? "حفظ التعديل" : "حفظ المنتج"}</button>
                  {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); setImagePreview(""); }} className="rounded-xl border border-green-900 px-5 py-3 font-bold text-green-900">إلغاء</button>}
                </div>
                {message && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-800">{message}</p>}
              </form>
            </section>

            <aside className="h-fit rounded-2xl border border-green-950/10 bg-white p-5 shadow-sm xl:sticky xl:top-8">
              <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-green-950">معاينة الصورة</h2><FiImage className="text-xl text-amber-600" /></div>
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#eef2ed]">
                {imagePreview ? <Image src={imagePreview} alt="معاينة المنتج" fill sizes="340px" className="object-cover" unoptimized={imagePreview.startsWith("blob:")} /> : <div className="text-center text-slate-400"><FiImage className="mx-auto text-4xl" /><p className="mt-3 text-sm">اختر صورة لتظهر هنا</p></div>}
              </div>
              <p className="mt-4 text-xs leading-6 text-slate-500">المعاينة تظهر فور اختيار الصورة، ويمكنك تغييرها قبل الحفظ.</p>
            </aside>
          </div>}

          {mode !== "create" && <section className="mt-8 rounded-2xl border border-green-950/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-slate-500">الكتالوج الخاص بك</p><h2 className="mt-1 text-2xl font-bold text-green-950">المنتجات المضافة</h2></div><span className="rounded-xl bg-green-100 px-4 py-2 text-sm font-bold text-green-900">{adminProducts.length} منتج</span></div>
            {adminProducts.length === 0 ? <p className="mt-6 rounded-xl bg-[#eef2ed] p-8 text-center text-sm text-slate-500">لا توجد منتجات مضافة من لوحة التحكم بعد.</p> : <div className="mt-6 grid gap-3 md:grid-cols-2">{adminProducts.map((product) => <div key={product.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"><div className="flex min-w-0 items-center gap-3">{product.image ? <Image src={product.image} alt="" width={52} height={52} className="h-13 w-13 shrink-0 rounded-lg object-cover" /> : <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-lg bg-[#eef2ed] text-slate-400"><FiImage /></div>}<div className="min-w-0"><h3 className="truncate font-bold text-green-950">{product.name}</h3><p className="text-sm text-slate-500">{product.price} ج.م</p></div></div><div className="flex shrink-0 gap-1"><button type="button" onClick={() => startEditing(product)} aria-label="تعديل المنتج" className="rounded-lg p-2 text-green-900 transition hover:bg-green-50"><FiEdit3 /></button><button type="button" onClick={() => handleDelete(product.id)} aria-label="حذف المنتج" className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"><FiTrash2 /></button></div></div>)}</div>}
          </section>}
        </section>
      </div>
    </main>
  );
}