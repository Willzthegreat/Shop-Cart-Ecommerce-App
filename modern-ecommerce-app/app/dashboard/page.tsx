import DashboardShell from "@/components/admin/DashboardShell";
import {
  getCategories,
  getAllBrands,
  getSellerProducts,
  getSellerTotalSales,
} from "@/queries";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  const [brands, categories, products, sales] = await Promise.all([
    getAllBrands(),
    getCategories(),
    getSellerProducts(),
    getSellerTotalSales(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardShell
        brands={brands}
        categories={categories}
        products={products}
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
