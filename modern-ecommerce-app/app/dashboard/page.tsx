import DashboardShell from "@/components/admin/DashboardShell";
import { getCategories } from "@/action/getAllBrand";
import { getAllBrands } from "@/queries";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  const [brands, categories] = await Promise.all([
    getAllBrands(),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardShell brands={brands} categories={categories} />
    </main>
  );
};

export default DashboardPage;

