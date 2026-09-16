"use client";

import {
  FiCheck,
  FiClipboard,
  FiCreditCard,
  FiTruck,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "١",
    title: "اختار اللي يعجبك",
    description: "تصفح المنتجات السعودية واختار احتياجك بسهولة.",
    icon: FiClipboard,
  },
  {
    number: "٢",
    title: "أكد طلبك",
    description: "ابعت بياناتك، وفريقنا يتواصل معك لتأكيد التفاصيل.",
    icon: FiCreditCard,
  },
  {
    number: "٣",
    title: "استلم لحد عندك",
    description: "نجهز طلبك بعناية ونوصله لباب بيتك في أسرع وقت.",
    icon: FiTruck,
  },
];

export default function HowItWorks() {
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
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="HowItWorks"
      dir="rtl"
      className={`how-it-works relative overflow-hidden bg-[#f6f3ec] px-5 py-16 sm:px-8 lg:px-16 ${isVisible ? "is-visible" : ""}`}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="how-it-works-heading max-w-2xl text-right">
          <p className="mb-3 text-sm font-bold tracking-[0.18em] text-amber-600">
            خدمتك أسهل مما تتخيل
          </p>
          <h2 className="text-3xl font-bold leading-tight text-green-950 sm:text-5xl">
            من اختيارك إلى باب بيتك
            <span className="mt-2 block text-amber-500">في 3 خطوات بسيطة</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            نوفر لك منتجات سعودية أصلية بطلب واضح ومتابعة شخصية، عشان تجربة الشراء
            تكون مريحة من أول نقرة لحد الاستلام.
          </p>
        </div>

        <div className="relative mt-12 grid gap-5 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden="true"
            className="step-connector absolute right-[calc(33.333%_-_21.33px)] top-10 z-0 hidden h-1 w-8 origin-right rounded-full bg-amber-400 md:block"
            style={{ animationDelay: "750ms" }}
          />
          <span
            aria-hidden="true"
            className="step-connector absolute right-[calc(66.667%_-_10.67px)] top-10 z-0 hidden h-1 w-8 origin-right rounded-full bg-amber-400 md:block"
            style={{ animationDelay: "2.05s" }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="step-card relative z-10 rounded-[1.5rem] border border-green-950/10 bg-white p-6 shadow-[0_18px_45px_rgba(31,61,42,0.08)]"
                style={{ animationDelay: `${index * 1300}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="step-icon flex h-16 w-16 items-center justify-center rounded-2xl bg-green-900 text-2xl text-amber-300 shadow-lg shadow-green-900/20 transition duration-500">
                    <Icon />
                  </div>
                  <span className="text-5xl font-bold text-green-950/10">{step.number}</span>
                </div>
                <h3 className="mt-8 text-xl font-bold text-green-950">{step.title}</h3>
                <p className="mt-3 min-h-14 text-sm leading-7 text-slate-500">{step.description}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-green-700">
                  <FiCheck /> تجربة واضحة ومضمونة
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
