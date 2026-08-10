'use client';

import { cn } from '@/lib/utils/utils';
import useStore from '@/store';
import { Product } from '@/types/product';
import { Heart } from 'lucide-react';
import React from 'react'

const AddToWishlist = ({
  product,
  className,
  
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite, removeFromFavorite } = useStore();
  const existingProduct = favoriteProduct.some(
    (item) => item?._id === product?._id,
  );

  const handleFavorite = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (existingProduct) {
      removeFromFavorite(product._id);
    } else {
      void addToFavorite(product);
    }
  };

  return (
    <>
      <div className={cn("absolute top-2 z-10", className)}>
        <div
          onClick={handleFavorite}
          aria-label={existingProduct ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "p-2.5 rounded-full hover:bg-shop-dark-green hover:text-white hover:cursor-pointer text-shop-light-green",
            existingProduct && "bg-shop-dark-green text-white",
          )}
        >
          <Heart size={15} fill={existingProduct ? "currentColor" : "none"} />
        </div>
      </div>
    </>
  )
}

export default AddToWishlist
