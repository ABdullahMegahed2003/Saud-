import AdminProductForm from "@/components/AdminProductForm/AdminProductForm";

export const metadata = { title: "إضافة منتج" };

export default function NewProductPage() {
  return <AdminProductForm mode="create" />;
}