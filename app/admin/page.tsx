import AdminProductForm from "@/components/AdminProductForm/AdminProductForm";

export const metadata = {
  title: "إدارة المنتجات",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminProductForm />;
}