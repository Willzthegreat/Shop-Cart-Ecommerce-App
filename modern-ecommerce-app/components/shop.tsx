"use client"

import { Category, Product } from "@/types/product";
import React, { useState } from "react";
import Container from "./container";
import Title from "./title";
import CategoryList from "./shop/categoryList";
import BrandsList from "./shop/brandsList";
import PriceList from "./shop/priceList";
import { useSearchParams } from "next/navigation";

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
  const [selectedPrice, setselectPrice] = useState<string | null>(null);  





  return (
    <>
      <div className="border-t ">
        <Container className="mt-5">
          <div className="sticky top-0 z-10 mb-5">
            <div className="flex items-center justify-between">
              <Title className="text-lg uppercase tracking-wide" >Get the products as your needs</Title>
              <button className="text-shop-dark-green underline text-sm mt-2 font-medium hover:text-shop-orange hoverEffect ">Reset Filters</button>
            </div>
          </div>
          <div  className="flex flex-col md:flex-row gap-5 border-t border-t-shop-dark-green/50 ">
            <div className="md:sticky md:top-20 md:self-start 
            md:h-[calc(100vh-160px)] md:overflow-y-auto md:overflow-x-hidden md:min-w-64
            pb-5 border-r border-r-shop-btn-dark-green/50
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
              <PriceList />
            </div>
            <div></div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Shop;
