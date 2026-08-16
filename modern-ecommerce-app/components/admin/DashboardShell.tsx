"use client";

import { useState } from "react";
import BlogUploader from "@/components/admin/BlogUploader";
import CategoryForm from "@/components/admin/CategoryForm";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import ImageUpLoader from "@/components/admin/ImageUpLoader";
import ProductForm from "@/components/admin/ProductForm";
import Overview from "@/components/admin/overview/page";

type Option = { _id: string; title: string };
type Brand = Option & { slug: string; logo?: string };
type DashboardView = "overview" | "products" | "orders" | "marketing" | "customers" | "content" | "analysis";

type DashboardShellProps = {
  brands: Brand[];
  categories: Option[];
  totalSales: number;
  percentageChange: number;
  totalOrders: number;
  visitors: number;
  ordersPercentageChange: number;
  visitorsPercentageChange: number;
};

const DashboardShell = ({
  brands,
  categories,
  totalSales,
  percentageChange,
  totalOrders,
  visitors,
  ordersPercentageChange,
  visitorsPercentageChange,
}: DashboardShellProps) => {
  const [activeView, setActiveView] = useState<DashboardView>("overview");

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <DashboardSidebar
        activeView={activeView}
        onViewChange={setActiveView}
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
            <div className="grid gap-6 justify-center px-3 lg:grid-cols-2">
              <ProductForm categories={categories} brands={brands} />
              <ImageUpLoader initialBrands={brands} />
              {/* <p className="text-center">Page is Under Construction and will be available shortly.</p> */}
            </div>
          )}

          {(activeView === "orders" || activeView === "customers") && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
              {activeView === "orders" ? "Orders" : "Customers"} management is
              coming soon.
            </div>
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
