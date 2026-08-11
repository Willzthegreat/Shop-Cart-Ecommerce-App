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
      <div className="flex flex-col items-stretch gap-5 py-5 md:flex-row md:items-start">
        <div className="flex w-full min-w-0 flex-row overflow-x-auto border py-3 md:min-w-20 md:w-auto md:flex-col md:overflow-x-visible">
          {categories?.map((item) => (
              <Button 
                key={item?._id}
                onClick={() => handleCategoryChange(item.slug)}
                className={`shrink-0 whitespace-nowrap bg-transparent border p-3 rounded-none 
                  md:w-full
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5 lg:px-10">
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
