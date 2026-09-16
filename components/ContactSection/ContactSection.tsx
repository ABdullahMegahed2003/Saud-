"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiMail, FiMessageCircle, FiPhone } from "react-icons/fi";
import styles from "./ContactSection.module.css";

const contactMethods = [
  { icon: FiMessageCircle, label: "واتساب", value: "راسلنا مباشرة", href: "https://wa.me/201000000000" },
  { icon: FiPhone, label: "الهاتف", value: "010 0000 0000", href: "tel:+201000000000" },
  { icon: FiMail, label: "البريد الإلكتروني", value: "hello@saudiandk.com", href: "mailto:hello@saudiandk.com" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="Contact" dir="rtl" className={`${styles.section} bg-green-950 px-5 py-16 text-white sm:px-8 lg:px-16 ${isVisible ? styles.visible : ""}`}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className={styles.copy}>
          <p className="text-sm font-bold tracking-[0.18em] text-amber-300">تواصل معنا</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">محتاج مساعدة في طلبك؟</h2>
          <p className="mt-5 max-w-xl leading-8 text-white/70">
            اسألنا عن أي منتج سعودي، أو ابعت اسم وصورة المنتج اللي بتدور عليه، وهنساعدك توصله في مصر.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/pre-order?type=custom" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-green-950 transition hover:-translate-y-1 hover:bg-amber-300">
              اطلب منتجك <FiArrowLeft />
            </Link>
            <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-white/10">
              تصفح المنتجات <FiArrowLeft />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a key={method.label} href={method.href} className={`${styles.card} group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition-all duration-300 hover:-translate-y-2 hover:border-amber-300/60 hover:bg-white/10`} style={{ animationDelay: `${180 + index * 130}ms` }}>
                <Icon className={`${styles.icon} text-2xl text-amber-300 transition-transform duration-300 group-hover:scale-110`} />
                <strong className="mt-5 block text-sm">{method.label}</strong>
                <span className="mt-2 block break-words text-xs leading-6 text-white/60">{method.value}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
