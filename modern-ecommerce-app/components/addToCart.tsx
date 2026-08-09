"use client";


import { Product } from "@/types/product";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import useStore from "@/store";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className}: Props) => {
  const isOutOfStock = product?.stock === 0;
  const addItem = useStore((state) => state.addItem);
  const removeItem = useStore((state) => state.removeItem);
  const quantity = useStore((state) => state.getItemCount(product._id));
  const stock = Number(product.stock);
  const canAddMore = !Number.isFinite(stock) || quantity < stock;



  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addItem(product);
      toast.success(`${product?.name?.substring(0,12)}... added successfully!`);

    }
  }

  return (
    <div className="flex w-full">
      {quantity > 0 ? (
        <div className={cn("flex w-full items-center justify-center gap-4 bg-shop-light-green py-3 text-sm font-medium text-white", className)}>
          <button
            type="button"
            aria-label={`Decrease ${product.name} quantity`}
            onClick={() => removeItem(product._id)}
            className="rounded border border-white/60 p-1 hover:bg-white/20"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-5 text-center">{quantity}</span>
          <button
            type="button"
            aria-label={`Increase ${product.name} quantity`}
            onClick={handleAddToCart}
            disabled={!canAddMore}
            className="rounded border border-white/60 p-1 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn("flex w-full items-center justify-center gap-2 rounded-none bg-shop-light-green py-6 text-sm font-medium text-white hover:bg-shop-dark-green hoverEffect", className)}
        >
          <ShoppingBag /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  )
}

export default AddToCartButton;
