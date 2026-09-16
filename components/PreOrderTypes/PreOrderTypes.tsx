"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiCalendar, FiClock, FiImage, FiPackage, FiPercent } from "react-icons/fi";
import styles from "./PreOrderTypes.module.css";

const orderTypes = [
  {
    icon: FiPackage,
    title: "منتج موجود عندنا",
    description: "اختار منتج من المتجر، حتى لو غير متوفر حاليًا، واحجزه بطلب مسبق.",
    link: "/products?filter=preorder",
    label: "احجز من المتجر",
    color: "bg-green-900 text-amber-300",
  },
  {
    icon: FiImage,
    title: "اطلب منتج معين",
    description: "مش لاقي المنتج؟ ابعت اسمه وصورته، وهنبحث عنه ونرجع لك بالتفاصيل.",
    link: "/pre-order?type=custom",
    label: "اطلب منتج خاص",
    color: "bg-amber-400 text-green-950",
  },
];

function AnimatedNumber({ value, isVisible }: { value: number; isVisible: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = requestAnimationFrame(() => setDisplayValue(value));
      return () => cancelAnimationFrame(reducedMotionFrame);
    }

    let animationFrame = 0;
    let startTime: number | undefined;
    const duration = 850;

    const animate = (timestamp: number) => {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.round(value * progress));

      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value]);

  return <span>{displayValue}</span>;
}

export default function PreOrderTypes() {
  const sectionRef = useRef<HTMLElement>(null);
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

  return (
    <section ref={sectionRef} id="PreOrder" dir="rtl" className={`${styles.section} bg-[#f8f6f0] px-5 py-14 sm:px-8 lg:px-16 ${isVisible ? styles.visible : ""}`}>
      <div className="mx-auto max-w-6xl">
        <div className={`${styles.heading} mb-8 text-right`}>
          <p className="text-sm font-bold tracking-[0.16em] text-amber-600">طلبك له طريقين</p>
          <h2 className="mt-2 text-3xl font-bold text-green-950 sm:text-4xl">اختار نوع الطلب المسبق</h2>
          <p className="mt-3 max-w-2xl leading-8 text-slate-500">
            اختار المنتج أو ابعت لنا صورته، وبعد تأكيد التفاصيل تدفع عربون 30% ونبدأ الحجز.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {orderTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <article key={type.title} className={`${styles.type} group rounded-3xl border border-green-950/10 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl sm:p-8`} style={{ animationDelay: `${150 + index * 140}ms, ${900 + index * 350}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${type.color}`}><Icon /></div>
                  <span className={`${styles.number} text-5xl font-bold text-green-950/10`} style={{ animationDelay: `${900 + index * 350}ms` }}>
                    {type.title === "منتج موجود عندنا" ? "١" : "٢"}
                  </span>
                </div>
                <h3 className="mt-7 text-2xl font-bold text-green-950">{type.title}</h3>
                <p className="mt-3 max-w-xl leading-8 text-slate-500">{type.description}</p>
                <Link href={type.link} className="mt-6 inline-flex items-center gap-2 font-bold text-green-800 transition-all duration-300 group-hover:gap-4">
                  {type.label} <FiArrowLeft />
                </Link>
              </article>
            );
          })}
        </div>

        <div className={`${styles.details} mt-6 grid gap-3 rounded-3xl border border-green-950/10 bg-white p-5 sm:grid-cols-3 sm:p-6`}>
          <div className={`${styles.detail} flex items-start gap-3`} style={{ animationDelay: "500ms" }}>
            <FiPercent className="mt-1 shrink-0 text-xl text-amber-600" />
            <div>
              <h3 className="font-bold text-green-950">العربون <AnimatedNumber value={30} isVisible={isVisible} />%</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">يتم دفعه بعد تأكيد المنتج والسعر.</p>
            </div>
          </div>
          <div className={`${styles.detail} flex items-start gap-3`} style={{ animationDelay: "600ms" }}>
            <FiClock className="mt-1 shrink-0 text-xl text-amber-600" />
            <div>
              <h3 className="font-bold text-green-950">المدة <AnimatedNumber value={7} isVisible={isVisible} /> إلى <AnimatedNumber value={14} isVisible={isVisible} /> يومًا</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">مدة متوقعة وقد تختلف حسب المنتج والتوفر.</p>
            </div>
          </div>
          <div className={`${styles.detail} flex items-start gap-3`} style={{ animationDelay: "700ms" }}>
            <FiCalendar className="mt-1 shrink-0 text-xl text-amber-600" />
            <div>
              <h3 className="font-bold text-green-950">التواصل والتوصيل</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">نتواصل معك عند الوصول وننسق باقي المبلغ والتوصيل.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
