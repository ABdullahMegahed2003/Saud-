import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلب منتجك",
  description: "ابعت اسم وصورة المنتج الذي تبحث عنه، وساعدك نوفره من السعودية ونوصله إلى مصر.",
};

export default function PreOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}