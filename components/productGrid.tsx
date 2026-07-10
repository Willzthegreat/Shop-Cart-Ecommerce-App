"use client";

import { useEffect, useState } from "react";
import HomeTabBar from "./homeTabBar";
import Image from "next/image";
import { productType } from "@/constants/data";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./noProductAvailable";
import { AnimatePresence, motion } from "motion/react";




interface Product {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  category?:
    | string
    | {
        title?: string;
      };
  images?: string[];
}

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState(
    productType[0]?.title || ""
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const apiUrl = "http://localhost:5000/api/products?tab=" + encodeURIComponent(selectedTab);
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
      <HomeTabBar
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 bg-gray-100 w-full my-10">
          <div className="flex items-center space-x-2 text-green-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Products are loading...</span>
          </div>
        </div>
      ) : products?.length ? (
        <div className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product?._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="border rounded-xl p-2 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-56 w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={product.images?.[0] || "/banner1.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  {typeof product.category === "object"
                    ? product.category?.title
                    : product.category}
                </p>

                <h2 className="font-semibold truncate">
                  {product.name}
                </h2>

                <p className="mt-2 font-bold">
                  ${product.price ?? "-"}
                </p>
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