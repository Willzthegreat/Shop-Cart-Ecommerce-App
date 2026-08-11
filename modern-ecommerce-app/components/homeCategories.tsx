"use client";

import Image from "next/image";
import Link from "next/link";
import { Title } from "./ui/text";
import type { Category } from "@/types/product";

interface HomeCategoriesProps {
  categories: Category[];
}

const categoryImages: Record<string, string> = {
  "air-conditioners": "/products/lg-inverter-ac1.jpg",
  appliances: "/products/ninja-air-fryer-max_1.jpg",
  "gadget-accessories": "/products/anker-737-power-bank_3.jpg",
  mobiles: "/products/iphone-17-pro1.jpg",
  smartphones: "/products/s25-ultra1.jpg",
  refrigerators: "/products/lg-smart-refrigerator1.jpg",
  "washing-machines": "/products/lg-washing-machine1.jpg",
  "kitchen-appliances": "/products/philips-blender-5000_1.jpg",
};

const HomeCategories = ({ categories }: HomeCategoriesProps) => {
  return (
    <div className="my-10 rounded-md border border-shop-light-green/20 bg-white p-5 lg:p-7 md:my-20">
      <Title className="border-b pb-3">Popular Categories</Title>

      <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Link
            key={category._id}
            href={`/category/${category.slug}`}
            className={`group flex min-w-0 flex-col items-center rounded-lg border p-3 transition hover:shadow-md sm:flex-row sm:p-4 ${
              index < 4
                ? "flex"
                : index < 6
                  ? "hidden md:flex"
                  : index < 8
                    ? "hidden lg:flex"
                    : "hidden"
            }`}
          >
            <Image
              src={category.image || categoryImages[category.slug] || "/products/iphone-17-pro1.jpg"}
              alt={`${category.title} category`}
              width={96}
              height={96}
              className="h-16 w-16 shrink-0 rounded-sm border object-contain transition-transform duration-300 group-hover:scale-110 sm:mr-2 sm:h-20 sm:w-20"
            />
            <div className="min-w-0 space-y-1 text-center sm:text-left">
              <h3 className="mt-2 break-words text-sm font-medium sm:mt-3">
                {category.title}
              </h3>

              {category.productCount !== undefined && (
                <p className="text-[10px] text-shop-dark-green">
                  {category.productCount} Products Available
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
