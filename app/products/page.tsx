import Nav from "@/components/Nav/Nav";
import Product from "@/components/Product/Product";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "منتجاتنا السعودية",
  description: "تصفح منتجات سعودية أصلية، واعرف السعر والحالة واطلب التوصيل داخل مصر.",
};



export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const initialFilter = params.filter === "preorder" ? "preorder" : "all";

  return (
   <>
   <Nav />
    <Product initialFilter={initialFilter} />

   </>
  );
}
