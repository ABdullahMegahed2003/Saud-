import AdminProductForm from "@/components/AdminProductForm/AdminProductForm";

export const metadata = { title: "تعديل المنتجات" };

export default function EditProductsPage() {
  return <AdminProductForm mode="manage" />;
}