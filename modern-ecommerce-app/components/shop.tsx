"use client"

import { Category, Product } from "@/types/product";
import React, { useEffect, useState } from "react";
import Container from "./container";
import Title from "./title";
import CategoryList from "./shop/categoryList";
import BrandsList from "./shop/brandsList";
import PriceList from "./shop/priceList";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./noProductAvailable";

type Brand = {
  _id: string;
  title: string;
  slug: string;
  logo?: string;
};

interface Props {
  categories: Category[];
  brands: Brand[];
}

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams.get("brand");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setselectedPrice] = useState<string | null>(null);  

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedBrand) params.set("brand", selectedBrand);
      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        params.set("minPrice", String(min));
        if (Number.isFinite(max)) params.set("maxPrice", String(max));
      }

      const response = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch products");

      const result = await response.json();
      setProducts(result.data || []);
    } catch (error) {
      console.error("Failed to load shop products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice])

  return (
    <>
      <div className="border-t ">
        <Container className="mt-5">
          <div className="sticky top-0 z-10 mb-5">
            <div className="flex items-center justify-between">
              <Title className="text-lg uppercase tracking-wide" >Get the products as your needs</Title>
              {(selectedCategory !== null ||
                selectedBrand !== null ||
                selectedPrice !== null 
              ) && (
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrand(null);
                    setselectedPrice(null); 
                  }}
                  className="text-shop-dark-green underline text-sm mt-2 
                  font-medium hover:text-shop-orange hoverEffect "
                  >Reset Filters</button>

              )}
            </div>
          </div>
          <div  className="flex min-w-0 flex-col gap-5 border-t border-t-shop-dark-green/50 md:flex-row ">
            <div className="w-full min-w-0 border-b border-b-shop-btn-dark-green/50 pb-5 md:sticky md:top-20 md:w-auto md:self-start 
            md:h-[calc(200vh-160px)] md:overflow-y-auto md:overflow-x-hidden md:min-w-64
            md:border-b-0 md:border-r md:border-r-shop-btn-dark-green/50 scrollbar-hide
            ">
              {/* CategoryList */}
              <CategoryList 
                categories={categories} 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
              {/* BrandList */}
              <BrandsList
                brands={brands}
                setSelectedBrand={setSelectedBrand}
                selectedBrand={selectedBrand}
              />
              {/* PriceList */}
              <PriceList
                setSelectedPrice={setselectedPrice}
                selectedPrice={selectedPrice}

              />
            </div>
            <div className="min-w-0 flex-1">
              {loading ? (
                <div className="flex min-h-80 items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading products...</span>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500">
                  <NoProductAvailable className="bg-white mt-0" />
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Shop;
