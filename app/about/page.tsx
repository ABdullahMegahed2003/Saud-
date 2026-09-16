import Link from "next/link";
import type { Metadata } from "next";
import { FiArrowLeft, FiHeart, FiPackage, FiSearch, FiShield, FiTruck } from "react-icons/fi";
import Nav from "@/components/Nav/Nav";

export const metadata: Metadata = {
  title: "عن سعودي عندك",
  description: "تعرف على سعودي عندك وكيف نوصل المنتجات السعودية الأصلية من السعودية إلى جميع محافظات مصر.",
};

const values = [
  {
    icon: FiShield,
    title: "اختيارات أصلية",
    description: "نختار منتجات سعودية بجودة واضحة ومواصفات نقدر نرشحها لك بثقة.",
  },
  {
    icon: FiTruck,
    title: "توصيل لحد عندك",
    description: "من لحظة تأكيد طلبك نتابع التجهيز والتوصيل حتى تستلمه بسهولة.",
  },
  {
    icon: FiHeart,
    title: "خدمة قريبة",
    description: "نسألك عن احتياجك ونساعدك تلاقي المنتج المناسب، حتى لو مش موجود في المتجر.",
  },
];

const journey = [
  { number: "٠١", icon: FiSearch, title: "اختار طلبك", text: "تصفح المنتجات السعودية أو ابعت اسم وصورة منتج معين." },
  { number: "٠٢", icon: FiPackage, title: "نجهزه من السعودية", text: "نراجع التفاصيل ونجهز طلبك من مصدره في السعودية." },
  { number: "٠٣", icon: FiTruck, title: "يوصل لمصر", text: "نتابع الشحن من السعودية حتى يصل طلبك لباب بيتك في مصر." },
];

const reasons = [
  "منتجات سعودية أصلية نختارها بعناية.",
  "توصيل من السعودية إلى مصر مع متابعة للطلب.",
  "إمكانية طلب منتج غير موجود في المتجر بالاسم والصورة.",
  "تفاصيل واضحة عن السعر والتوفر قبل تأكيد الطلب.",
  "خدمة عملاء قريبة تتابع معك حتى الاستلام.",
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main dir="rtl" className="min-h-screen bg-[#f8f6f0] text-green-950">
        <section className="relative overflow-hidden bg-green-950 px-5 py-20 text-white sm:px-8 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold tracking-[0.18em] text-amber-300">عن سعودي عندك</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
              منتجات سعودية أصلية،
              <span className="block text-amber-300">توصل لحد عندك.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              سعودي عندك منصة بتجيب لك المنتجات السعودية من السعودية إلى مصر. بنختار بعناية، نتابع الشحن، ونساعدك كمان في الوصول لمنتج معين من اختيارك.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-green-950 transition hover:-translate-y-1 hover:bg-amber-300">
                تصفح المتجر <FiArrowLeft />
              </Link>
              <Link href="/pre-order?type=custom" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-white/10">
                اطلب منتج معين <FiArrowLeft />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-[0.16em] text-amber-600">ليه سعودي عندك؟</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">تجربة شراء بسيطة وواضحة</h2>
              <p className="mt-4 leading-8 text-slate-500">هدفنا نخلي وصول المنتجات السعودية إلى مصر أسهل، من أول اختيار المنتج لحد ما يوصل لباب بيتك.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <article key={value.title} className="rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-900 text-2xl text-amber-300"><Icon /></div>
                    <h3 className="mt-6 text-xl font-bold">{value.title}</h3>
                    <p className="mt-3 leading-7 text-slate-500">{value.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="about-reasons bg-green-950 px-5 py-16 text-white sm:px-8 lg:px-16 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="about-reasons-copy relative">
              <span className="absolute -right-4 -top-10 text-8xl font-bold text-white/[0.04]">ثقة</span>
              <p className="relative text-sm font-bold tracking-[0.18em] text-amber-300">ليه تختارنا؟</p>
              <h2 className="relative mt-4 text-4xl font-bold leading-tight sm:text-5xl">من السعودية لمصر بثقة</h2>
              <p className="relative mt-6 max-w-md text-base leading-8 text-white/70">نختصر عليك وقت البحث ونتابع التفاصيل بدل ما تنشغل بمراحل الشراء والشحن.</p>
              <div className="mt-9 flex gap-8 border-t border-white/15 pt-6">
                <div>
                  <strong className="block text-3xl text-amber-300">١٠٠٪</strong>
                  <span className="mt-1 block text-sm text-white/60">اختيارات أصلية</span>
                </div>
                <div>
                  <strong className="block text-3xl text-amber-300">٢</strong>
                  <span className="mt-1 block text-sm text-white/60">طريقة للطلب</span>
                </div>
              </div>
            </div>
            <ol className="relative border-r border-amber-300/40 pr-6">
              {reasons.map((reason, index) => (
                <li key={reason} style={{ animationDelay: `${index * 140 + 180}ms` }} className="about-reason-item group relative mb-4 last:mb-0">
                  <span className="absolute -right-[2.15rem] top-4 flex h-7 w-7 items-center justify-center rounded-full border border-amber-300 bg-green-950 text-xs font-bold text-amber-300 transition duration-300 group-hover:scale-125 group-hover:bg-amber-300 group-hover:text-green-950">
                    {(index + 1).toLocaleString("ar-EG")}
                  </span>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 group-hover:translate-x-[-6px] group-hover:border-amber-300/50 group-hover:bg-white/[0.09]">
                    <p className="text-sm leading-7 text-white/85">{reason}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-green-950/10 bg-white px-5 py-16 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-bold tracking-[0.16em] text-amber-600">رحلتك معنا</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">من الاختيار إلى الاستلام</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {journey.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.number} className="relative rounded-3xl border border-green-950/10 p-6 text-center">
                    <span className="text-5xl font-bold text-green-950/10">{item.number}</span>
                    <Icon className="mx-auto mt-2 text-3xl text-green-800" />
                    <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-500">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 text-center sm:px-8 lg:px-16">
          <h2 className="text-3xl font-bold sm:text-4xl">جاهز تختار منتجك؟</h2>
          <p className="mx-auto mt-4 max-w-xl leading-8 text-slate-500">ابدأ من المنتجات المتاحة أو ابعت لنا صورة المنتج اللي بتدور عليه.</p>
          <div className="mt-7 flex justify-center gap-3">
            <Link href="/products" className="rounded-full bg-green-900 px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-green-800">ابدأ التسوق</Link>
            <Link href="/pre-order?type=custom" className="rounded-full border border-amber-500 px-6 py-3 font-bold text-amber-700 transition hover:bg-amber-50">اطلب منتج خاص</Link>
          </div>
        </section>
      </main>
    </>
  );
}
