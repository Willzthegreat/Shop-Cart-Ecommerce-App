import { Product } from '@/types/product';
import { Heart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'





const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product | null | undefined;
}) => {
  return (
    <>
      {!showProduct ? (
      <Link href='/wishlist' className="group relative">
        <Heart className='w-5 h-5 hover:text-shop-light-green' />
        <span className="absolute -top-2 -right-2 bg-shop-dark-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          0
        </span>
      </Link>
      ) : (
        <button className="group relative hover:text-shop-light-green hoverEffect">
          <Heart className="text-shop-light-green/80 group-hover:text-shop-light-green hoverEffect mt-.5 w-13 h-12 p-2 border border-shop-light-green rounded-[4px] " />
        </button>
      )}
    </>
  )
}

export default FavoriteButton
