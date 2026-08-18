"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BlogUploader from "@/components/admin/BlogUploader";
import CategoryForm from "@/components/admin/CategoryForm";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import ImageUpLoader from "@/components/admin/ImageUpLoader";
import ProductForm from "@/components/admin/ProductForm";
import Overview from "@/components/admin/overview/page";
import UsersProductDashboard from "./usersProductDashboard";
import OrdersPage from "./OrdersPage";
import CustomersPage from "./customersPage";

type Option = { _id: string; title: string };
type Brand = Option & { slug: string; logo?: string };
type Product = {
  _id: string;
  name: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  category?: Option | null;
  brand?: Brand | null;
  image?: string;
};
type DashboardView = "overview" | "products" | "orders" | "marketing" | "customers" | "content" | "analysis";

type DashboardShellProps = {
  brands: Brand[];
  categories: Option[];
  products: Product[];
  totalSales: number;
  totalSold: number;
  orders: {
    _id: string;
    customerName: string;
    email: string;
    totalPrice: number;
    currency: string;
    status: string;
    orderDate: string | Date;
    itemCount: number;
  }[];
  percentageChange: number;
  totalOrders: number;
  visitors: number;
  ordersPercentageChange: number;
  visitorsPercentageChange: number;
};

const DashboardShell = ({
  brands,
  categories,
  products,
  totalSales,
  totalSold,
  orders,
  percentageChange,
  totalOrders,
  visitors,
  ordersPercentageChange,
  visitorsPercentageChange,
}: DashboardShellProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const viewFromUrl = searchParams.get("view");
  const initialView: DashboardView =
    viewFromUrl === "analysis"
      ? "analysis"
      : viewFromUrl === "products" ||
          viewFromUrl === "orders" ||
          viewFromUrl === "marketing" ||
          viewFromUrl === "customers" ||
          viewFromUrl === "content" ||
          viewFromUrl === "overview"
        ? viewFromUrl
        : "overview";

  const [activeView, setActiveView] = useState<DashboardView>(initialView);

  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  const changeView = (view: DashboardView) => {
    setActiveView(view);

    const params = new URLSearchParams(searchParams.toString());
    if (view === "overview") params.delete("view");
    else params.set("view", view);

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <DashboardSidebar
        activeView={activeView}
        onViewChange={changeView}
      />

      <section className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {activeView[0].toUpperCase() + activeView.slice(1)}
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage your store from one place.
            </p>
          </header>

          {activeView === "overview" && (
            <div className="w-full">
              <Overview
                totalSales={totalSales}
                percentageChange={percentageChange}
                totalOrders={totalOrders}
                visitors={visitors}
                ordersPercentageChange={ordersPercentageChange}
                visitorsPercentageChange={visitorsPercentageChange}
              />
            </div>
          )}

          {activeView === "products" && (
            <div className="px-3 ">
            <UsersProductDashboard
              brands={brands}
              categories={categories}
              products={products}
              totalSold={totalSold}
            />
            </div>
          )}

          {activeView === "orders" && <OrdersPage orders={orders} />}

          {activeView === "customers" && (
            // <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            //   Customers management is coming soon.
            // </div>
            <CustomersPage  />
          )}
          
          {activeView === "marketing" && (
            <div className="grid gap-6 lg:grid-cols-2">
              Marketing View is coming.
              <CategoryForm />
              <ProductForm categories={categories} brands={brands} />
              <div className="lg:col-span-2">
                <ImageUpLoader initialBrands={brands} />
              </div>
              <div className="mx-auto max-w-3xl lg:col-span-2">
                <BlogUploader />
              </div>
            </div>
          )}
          
          {activeView === "content" && (
            <div className="grid gap-6 lg:grid-cols-2">
              Contents will be made available soon.
            </div>
          )}
          {activeView === "analysis" && (
            <div className="grid gap-6 lg:grid-cols-2">
              Analysis will be made available soon.
            </div>
          )}
        
        </div>
      </section>
    </div>
  );
};

export default DashboardShell;
