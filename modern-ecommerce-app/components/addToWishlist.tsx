import { cn } from '@/lib/utils/utils';
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
  return (
    <>
      <div className={cn("absolute top-2 z-10", className)}> 
        <div className={`p-2.5  rounded-full hover:bg-shop-dark-green hover:text-white hover:cursor-pointer text-shop-light-green`}>
          <Heart size={15}/>
        </div>
      </div>
    </>
  )
}

export default AddToWishlist
