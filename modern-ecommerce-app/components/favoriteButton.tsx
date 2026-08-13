'use client';

import { Product } from '@/types/product';
import { Heart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useStore from '@/store';
import toast from 'react-hot-toast';


interface Props {
  className?: string;
  size?: "default" | "small";
}



const FavoriteButton = ({
  showProduct = false,
  product,
  className,
  size = "default",
}: {
  showProduct?: boolean;
  product?: Product | null | undefined;
  className?: string;
  size?: "default" | "small";
}) => {
  const { favoriteProduct, addToFavorite, removeFromFavorite } = useStore();
  const isFavorite = product
    ? favoriteProduct.some((item) => item._id === product._id)
    : false;

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!product) return;

    if (isFavorite) {
      removeFromFavorite(product._id);
      toast.success(`${product.name.substring(0, 12)}... removed from wishlist!`);
    } else {
      void addToFavorite(product);
      toast.success(`${product.name.substring(0, 12)}... added to wishlist!`);
    }
  };

  return (
    <>
      {!showProduct ? (
      <Link href='/wishlist' className={`group relative ${className}`}>
        <Heart className='w-5 h-5 hover:text-shop-light-green' />
        {favoriteProduct.length > 0 ? (
          <span className="absolute -top-2 -right-2 bg-shop-dark-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {favoriteProduct.length}
          </span>
        ) : null}
      </Link>
      ) : (
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          className={`group relative hover:text-shop-light-green hoverEffect ${className}`}
        >
          <Heart
            fill={isFavorite ? "currentColor" : "none"}
            className={`mt-.5 rounded-[4px] border border-shop-light-green text-shop-light-green/80 group-hover:text-shop-light-green hoverEffect ${
              size === "small" ? "h-9 w-9 p-1.5" : "h-12 w-13 p-2"
            }`}
          />
        </button>
      )}
    </>
  )
}

export default FavoriteButton
