import BlogUploader from "@/components/admin/BlogUploader";
import CategoryForm from "@/components/admin/CategoryForm";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import ImageUpLoader from "@/components/admin/ImageUpLoader";
import ProductForm from "@/components/admin/ProductForm";
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
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        <DashboardSidebar />

        <section className="min-w-0 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Manage your store from one place.
              </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-2">
              <CategoryForm />
              <ProductForm categories={categories} brands={brands} />
            </div>

            <div className="mt-6">
              <ImageUpLoader initialBrands={brands} />
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              <BlogUploader />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
