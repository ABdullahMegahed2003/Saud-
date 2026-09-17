import { redirect } from "next/navigation";

export const metadata = {
  title: "إدارة المنتجات",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  redirect("/admin/products/new");
}