import ImageUpLoader from "@/components/admin/ImageUpLoader";
import BlogUploader from "@/components/admin/BlogUploader";
import CategoryForm from "@/components/admin/CategoryForm";
import ProductForm from "@/components/admin/ProductForm";
import { getAllBrands, getCategories } from "@/queries";

export const dynamic = "force-dynamic";

const Page = async () => {
  const [brands, categories] = await Promise.all([getAllBrands(), getCategories()]);

  return (
    <>
      <section>
        <div>
          {/* <HomeBanner /> */}
          <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-2">
            <CategoryForm />
            <ProductForm categories={categories} brands={brands} />
          </div>
          <ImageUpLoader initialBrands={brands} />
          <div className="mx-auto mt-10 max-w-3xl">
            <BlogUploader />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
