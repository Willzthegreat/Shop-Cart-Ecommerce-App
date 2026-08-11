"use client";
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Category } from '@/types/product';
import { useRouter } from 'next/navigation';
import ProductCard from './ProductCard'
import type { Product } from '@/types/product';
import { Loader2 } from 'lucide-react';


interface Props {
    categories: Category[];
    slug: string;
}



const CategoryProducts = ({categories, slug}: Props ) => {
    const [currentSlug, setCurrentSlug] = useState(slug);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
      let cancelled = false;
      const loadProducts = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/products?category=${encodeURIComponent(currentSlug)}`);
          if (!response.ok) throw new Error(`Failed to fetch category products (${response.status})`);
          const result = await response.json();
          if (!cancelled) setProducts(result.data || []);
        } catch (error) {
          console.error("Category products fetching error:", error);
          if (!cancelled) setProducts([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      loadProducts();
      return () => { cancelled = true; };
    }, [currentSlug]);

    const handleCategoryChange = (newSlug: string) => {
      if (newSlug === currentSlug) return;
      setCurrentSlug(newSlug);
      router.push(`/category/${newSlug}`, { scroll: false }); 
    }

  return (
    <>
      <div className="flex flex-col py-5 md:flex-row gap-5 items-start">
        <div className="flex flex-col py-3 md:min-w-20 border ">
          {categories?.map((item) => (
              <Button 
                key={item?._id}
                onClick={() => handleCategoryChange(item.slug)}
                className={`bg-transparent border p-3  rounded-none 
                  text-dark-color shadow-none hover:bg-shop-orange hover:text-white 
                  font-semibold hoverEffect border-b-2  last:border-b-2 capitalize
                  ${item.slug === currentSlug ? "bg-shop-orange text-white border-shop-orange" : ""} `}>
                <p> 
                  {item?.title}
                </p>
              </Button>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="flex min-h-20 items-center justify-center gap-2 text-green-600">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading products...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5 px-4 md:px-10">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">No products available in this category.</div>
          )}
        </div>
      </div>
    </>
  )
}

export default CategoryProducts
