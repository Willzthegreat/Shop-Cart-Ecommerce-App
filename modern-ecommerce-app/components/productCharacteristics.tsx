//  import { getBrand } from '@/queries/query';
// import { Product } from '@/types/product';
// import React from 'react'
// import { Accordion, AccordionItem, AccordTrigger, AccordContent} from './ui/accordion';
 
//  const ProductCharacteristics = async({
//     product,
//     }: {
//         product: Product | null | undefined;
//     }) => { 
//         const brand = await getBrand(product?.brand as string);

//    return (
//      <>
//         <Accordion type="single" collapsible className="w-full">
//           <AccordionItem value="item-1">
//             <AccordTrigger>
//               {product?.name}: Characteristics
//             </AccordTrigger>
//             <AccordContent>
//               <p>Brand: {brand && <span>{brand[0]?.brandName}</span>}</p>
//             </AccordContent>  
//           </AccordionItem>
//         </Accordion> 
//      </>
//    )
//  }
 
//  export default ProductCharacteristics
 














import { Product } from "@/types/product";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

const ProductCharacteristics = ({
  product,
}: {
  product: Product | null | undefined;
}) => {
  if (!product) return null;

  const brandName =
    typeof product.brand === "string"
      ? product.brand
      : product.brand?.title;

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.title;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>{product.name}: Characteristics</AccordionTrigger>

        <AccordionContent>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt>Brand</dt>
              <dd className="font-semibold tracking-wide">{brandName || "N/A"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Collection</dt>
              <dd className="font-semibold tracking-wide">{categoryName || "N/A"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Type</dt>
              <dd className="font-semibold tracking-wide">
                {product.variants?.join(", ") || "N/A"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Stock</dt>
              <dd className="font-semibold tracking-wide">
                {product.stock ?? 0}
              </dd>
            </div>
            {product.code && (
              <div className="flex items-center justify-between gap-4">
                <dt>Product code</dt>
                <dd className="font-semibold tracking-wide">{product.code}</dd>
              </div>
            )}
          </dl>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;

