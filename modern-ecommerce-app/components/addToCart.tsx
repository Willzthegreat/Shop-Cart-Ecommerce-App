"use client";


import { Product } from "@/types/product";
import React from "react";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className}: Props) => {
  const isOutOfStock = product?.stock === 0;
  const handleAddToCart = () => {
    
  }

  return (
    <>
      <div>
         <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn("flex w-full items-center justify-center gap-2 bg-shop-light-green py-8 rounded-none text-sm font-medium text-white hover:bg-shop-dark-green hoverEffect", className)}>
          <ShoppingBag /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
         </Button>
      </div>
    </>
  )
}

export default AddToCartButton;