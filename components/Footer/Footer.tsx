"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowUp, FiMail, FiMessageCircle, FiPhone } from "react-icons/fi";

const footerLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "عنا", href: "/about" },
  { label: "المتجر", href: "/products" },
  { label: "اطلب منتجك", href: "/pre-order?type=custom" },
  { label: "الأسئلة الشائعة", href: "/#FAQ" },
];

const contactLinks = [
  { label: "واتساب", value: "راسلنا مباشرة", href: "https://wa.me/201000000000", icon: FiMessageCircle },
  { label: "الهاتف", value: "010 0000 0000", href: "tel:+201000000000", icon: FiPhone },
  { label: "البريد", value: "hello@saudiandk.com", href: "mailto:hello@saudiandk.com", icon: FiMail },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer dir="rtl" className="bg-green-950 px-5 pb-6 pt-14 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.3fr_0.7fr_1fr]">
          <div>
            <Link href="/" className="inline-block text-2xl font-bold text-amber-300">سعودي عندك</Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
              منتجات سعودية أصلية من السعودية إلى مصر، مع خدمة قريبة وتوصيل لحد عندك.
            </p>
            <Link href="/pre-order?type=custom" className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-green-950 transition hover:-translate-y-1 hover:bg-amber-300">
              اطلب منتجك <FiArrowUp className="rotate-45" />
            </Link>
          </div>

          <div>
            <h2 className="font-bold text-white">روابط سريعة</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-amber-300">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-white">تواصل معنا</h2>
            <div className="mt-4 space-y-3">
              {contactLinks.map((contact) => {
                const Icon = contact.icon;
                return (
                  <a key={contact.label} href={contact.href} className="flex items-center gap-3 text-sm text-white/60 transition hover:text-amber-300">
                    <Icon className="text-lg" />
                    <span><strong className="block text-white/85">{contact.label}</strong>{contact.value}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© ٢٠٢٦ سعودي عندك. كل الحقوق محفوظة.</p>
          <p>من السعودية إلى مصر بكل ثقة</p>
        </div>
      </div>
    </footer>
  );
}
