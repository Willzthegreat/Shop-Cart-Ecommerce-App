"use client";

import { useEffect, useState } from "react";
import HomeTabBar from "./homeTabBar";
import { productType } from "@/constants/data";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./noProductAvailable";
import { AnimatePresence, motion } from "motion/react";
import ProductCard from "./productCard";
import type { Product } from "@/types/product";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const apiUrl = "/api/products?tab=" + encodeURIComponent(selectedTab);
        console.log("Fetching products from:", apiUrl);
        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        console.log(res);

        const json = await res.json();
        console.log("JSON Response:", json);
        setProducts(json.data || []);
      } catch (error) {
        console.error("Product fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedTab]);

  return (
    <>
      <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 bg-gray-100 w-full my-10">
          <div className="flex items-center space-x-2 text-green-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Products are loading...</span>
          </div>
        </div>
      ) : products?.length ? (
        <div className="my-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </>
  );
};

export default ProductGrid;
