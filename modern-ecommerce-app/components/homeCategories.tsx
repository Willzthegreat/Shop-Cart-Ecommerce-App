// import React from 'react'
// import { Title } from './ui/text';


// const HomeCategories = ({categories}:{categories: Category[]}) => {
//   return (
//     <>
//       <div className='bg-white border border-shop-light-green/20 my-10 md:my-20 p-5 lg:p-7 rounded-md'>
//         <Title  className="border-b pb-3">Popular Categories</Title>
//         <div>
//           {categories?.map((category) => <div
//           key={category?._id} >
//             {category?.image && (
//               <Image
//                 src={urlFor(category?.image).url()}
//                 alt={categoryImage}
//                 width={500}
//                 height={500}
//                 className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
//             )}
            
//           </div>)}

//         </div>
//       </div>
//     </>
//   )
// }

// export default HomeCategories;







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

      <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center rounded-lg border p-4 transition hover:shadow-md"
          >
            <Image
              src={category.image || categoryImages[category.slug] || "/products/iphone-17-pro1.jpg"}
              alt={`${category.title} category`}
              width={96}
              height={96}
              className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-110"
            />

            <h3 className="mt-3 text-center font-medium">
              {category.title}
            </h3>

            {category.productCount !== undefined && (
              <p className="text-sm text-gray-500">
                {category.productCount} Products
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
