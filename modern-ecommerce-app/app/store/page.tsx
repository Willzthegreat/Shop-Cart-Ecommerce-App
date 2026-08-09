import { Suspense } from "react";
import { getAllBrands, getCategories } from "@/queries";
import Shop from "@/components/shop";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getAllBrands(),
  ]);

  return (
    <Suspense fallback={<div className="p-6">Loading store...</div>}>
      <Shop categories={categories} brands={brands} />
    </Suspense>
  );
}
