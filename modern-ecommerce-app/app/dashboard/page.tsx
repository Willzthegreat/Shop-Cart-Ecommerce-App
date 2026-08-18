import DashboardShell from "@/components/admin/DashboardShell";
import {
  getSellerCategories,
  getAllBrands,
  getSellerProducts,
  getSellerTotalSales,
  getSellerOrders,
} from "@/queries";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  const [brands, categories, products, sales, orders] = await Promise.all([
    getAllBrands(),
    getSellerCategories(),
    getSellerProducts(),
    getSellerTotalSales(),
    getSellerOrders(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardShell
        brands={brands}
        categories={categories}
        products={products}
        totalSales={sales.totalSales}
        totalSold={sales.totalSold}
        orders={orders}
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
