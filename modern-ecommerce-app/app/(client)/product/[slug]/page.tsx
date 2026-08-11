import AddToCartButton from "@/components/addToCart";
import Container from "@/components/container";
import FavoriteButton from "@/components/favoriteButton";
import ImageView from "@/components/imageView";
import PriceView from "@/components/priceView";
import ProductCharacteristics from "@/components/productCharacteristics";
import { getProductBySlug } from "@/queries/query";
import { CornerDownLeft, StarIcon, Truck } from "lucide-react";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb"




const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  return ( 
    <>
    <Container className="py-15 flex flex-col md:flex-row gap-10 pb-10">
      {/* Product Images */}
      <ImageView
        images={product.images ?? []}
        isStock={product.stock}
      />

      {/* Product Details */}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div className="space-y-5">
          <h2 className="text-3xl font-bold">
            {product.name}
          </h2>

          <p className="text-gray-600 tracking-wide">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-0.5 text-xs">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className="text-shop-light-green"
                fill="#3b9c3c"
              />
            ))}

            <p className="font-semibold">(120)</p>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2 border-t border-b border-gray-200 py-5">
          <PriceView
            price={product.price}
            discount={product.discount}
            className="text-lg font-bold"
          />
        </div>

        {/* Stock Status */}
        <p className="font-bold text-lg">
          Current State:
          <span
            className={`font-medium text-sm text-center inline-block rounded-sm px-4 py-2 ml-2 ${
              product.stock === 0
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}>

            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </p>

        {/* Actions */}
        <div className="mt-5 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:gap-5">
          <div className="min-w-0 flex-1">
            <AddToCartButton product={product} className="w-full rounded-sm" />
          </div>

          <div className="flex justify-start sm:shrink-0">
            <FavoriteButton showProduct={true} product={product} />
          </div>
        </div>
        <ProductCharacteristics product={product} />
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b 
        border-b-gray-200 mt-2 py-5">
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <RxBorderSplit className="text-lg" />
            <p>Compare Color </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <FaRegQuestionCircle className="text-lg" />
            <p>Ask a Question </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <TbTruckDelivery className="text-lg" />
            <p>Delivery & Return</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <FiShare2 className="text-lg" />
            <p>Share</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
            <Truck size={30} className="text-shop-orange" />
            <div>
              <p className="text-base font-semibold text-black">
                Free Delivery
              </p>
              <p className="text-sm text-gray-500 underline underline-offset-2"> 
                Enter your Postal Code for Delivery Availability
              </p>
            </div>
          </div>
          <div className="border border-lightColor/25 p-3 flex items-center gap-2">
            <CornerDownLeft size={30} className="text-shop-orange" />
            <div >
              <p className="text-base font-semibold text-black">
                Return Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
    <div>
      Love of God
    </div>
  </>
  );
};

export default SingleProductPage;
