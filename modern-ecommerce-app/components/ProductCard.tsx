"use client";

import Image from "next/image";
import Link from "next/link";
import { FlameIcon, ShoppingCart, StarIcon } from "lucide-react";
// import { Eye, FlameIcon, Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import AddToWish from "./addToWishlist";
import PriceView from "./priceView";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/products/product-placeholder.png";

  // `price`, `discount`, and `stock` are returned directly from MongoDB.
  // The discount is stored as a percentage, so do not derive it from the
  // optional `originalPrice` field.
  const discount = Math.max(0, Number(product.discount ?? 0));

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.title || "General";

  const brandName =
    typeof product.brand === "string"
      ? product.brand
      : product.brand?.title || "";

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="flex justify-around px-2">
          <div>
            {product.status === "sale" && (
              <span className="absolute left-3 top-3 rounded-full bg-shop-light-green hover:cursor-pointer hover:border group-hover:border-shop-light-green hoverEffect hover:bg-white hover:text-shop-light-green border px-3 py-1 text-xs font-semibold text-white">
                SALE
              </span>
            )}

            {product.status === "new" && (
              <Link href={"/new"} className="absolute left-3 top-3 rounded-full bg-shop-light-green
              hover:cursor-pointer hover:border group-hover:border-shop-light-green hoverEffect hover:bg-white hover:text-shop-light-green border px-3 py-1 text-xs font-semibold text-white">
                <FlameIcon size={14} />
              </Link>
            )}

            {discount > 0 && (
              <span className="absolute right-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                -{discount}%
              </span>
            )}
          </div>
          <div>
            <AddToWish product={product} />
          </div>
        </div>
        

        {/* Add to Cart */}
       <div className="absolute bottom-0 left-0 w-full translate-y-full transition-all duration-300 group-hover:translate-y-0">
          <button className="flex w-full items-center justify-center gap-2 bg-shop-light-green py-3 text-sm font-medium text-white hover:bg-shop-dark-green">
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {categoryName}
        </p>

        <Link href={`/product/${product.slug}`}>
          <h2 className="line-clamp-1 text-base font-semibold hover:text-green-600">
            {product.name}
          </h2>
        </Link>

        {brandName && (
          <p className="text-sm text-gray-500">{brandName}</p>
        )}

        {product.code && (
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Code: {product.code}
          </p>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <PriceView
              price={product.price}
              discount={discount}
              className="text-shop-dark-green text-medium font-semibold"
            />
          </div>
        </div>
        <div className="flex items-center ">
          <div className="flex items-center gap-1 ">
            {[...Array(5)].map((_, index) => (
              <StarIcon  key={index} size={12} className={
                index < 4 
                ? "text-shop-lighter-green" 
                : "text-shopLighterText"
              } />
            ))}
          </div>
          <p className="text-shopLightText text-[10px] pt-1 px-2 tracking-wide">5 Reviews</p>
        </div>

        <p
          className={`text-sm ${
            (product.stock ?? 0) > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {(product.stock ?? 0) > 0
            ? `In Stock: ${product.stock}`
            : "Out of Stock (0)"}
        </p>
      </div>
    </div>
  );
}
