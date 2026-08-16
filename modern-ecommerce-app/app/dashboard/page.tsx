import DashboardShell from "@/components/admin/DashboardShell";
import { getCategories } from "@/action/getAllBrand";
import { getAllBrands, getSellerTotalSales } from "@/queries";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  const [brands, categories, sales] = await Promise.all([
    getAllBrands(),
    getCategories(),
    getSellerTotalSales(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardShell
        brands={brands}
        categories={categories}
        totalSales={sales.totalSales}
        percentageChange={sales.percentageChange}
        totalOrders={sales.totalOrders}
        visitors={sales.visitors}
        ordersPercentageChange={sales.ordersPercentageChange}
        visitorsPercentageChange={sales.visitorsPercentageChange}
      />
    </main>
  );
};

export default DashboardPage;
