"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";
import styles from "./FAQSection.module.css";

const questions = [
  {
    question: "المنتجات بتوصل منين؟",
    answer: "بنختار المنتجات من السعودية ونوصلها لعملائنا داخل مصر حتى باب البيت.",
  },
  {
    question: "إزاي أطلب منتج معين مش موجود في المتجر؟",
    answer: "ادخل على صفحة اطلب منتجك، اكتب اسم المنتج وارفع صورته، وفريقنا هيراجع طلبك ويتواصل معك.",
  },
  {
    question: "يعني إيه طلب مسبق؟",
    answer: "هو حجز منتج قبل وصوله، وبعد تأكيد التفاصيل نبدأ في توفيره وشحنه إلى مصر.",
  },
  {
    question: "العربون كام؟",
    answer: "العربون 30% بعد تأكيد المنتج والسعر، ويتم تنسيق باقي المبلغ عند وصول الطلب.",
  },
  {
    question: "الطلب بياخد وقت قد إيه؟",
    answer: "المدة المتوقعة من 7 إلى 14 يومًا، وقد تختلف حسب المنتج والتوفر والشحن.",
  },
  {
    question: "هل أقدر أتابع طلبي؟",
    answer: "نعم، بنتواصل معك أثناء تجهيز الطلب والشحن وحتى تنسيق التوصيل داخل مصر.",
  },
  {
    question: "هل الموقع بيشتغل في كل محافظات مصر؟",
    answer: "أيوه، سعودي عندك بيخدم جميع محافظات مصر، وبنوصل طلبك لحد باب البيت حسب عنوانك.",
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(0);
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
    <section ref={sectionRef} id="FAQ" dir="rtl" className={`${styles.section} bg-white px-5 py-16 sm:px-8 lg:px-16 ${isVisible ? styles.visible : ""}`}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className={styles.heading}>
          <div className={`${styles.helpIcon} flex h-14 w-14 items-center justify-center rounded-2xl bg-green-900 text-2xl text-amber-300`}>
            <FiHelpCircle />
          </div>
          <p className="mt-6 text-sm font-bold tracking-[0.18em] text-amber-600">عندك سؤال؟</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-green-950 sm:text-5xl">الأسئلة الشائعة</h2>
          <p className="mt-5 max-w-md leading-8 text-slate-500">
            جمعنا لك أهم التفاصيل عن المنتجات، الطلب المسبق، الشحن من السعودية، والتوصيل داخل مصر.
          </p>
        </div>

        <div className="space-y-3">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={`${styles.item} overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? "border-green-900/20 bg-green-50 shadow-sm" : "border-slate-200 bg-white"}`} style={{ animationDelay: `${150 + index * 90}ms` }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right font-bold text-green-950"
                >
                  <span>{item.question}</span>
                  <FiChevronDown className={`shrink-0 text-xl text-green-800 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-7 text-slate-600">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
