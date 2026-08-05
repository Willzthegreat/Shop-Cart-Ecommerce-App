// import React from 'react'
// import PriceFormatter from './priceFormatter';


// interface Props {
//     price: number | undefined;
//     discount: number | undefined;
//     className: string;
// }


// const PriceView = ({ price, discount, className }: Props) => {
//   return (
//     <>
//       <div>
//         <PriceFormatter amount={price} className='text-shop-dark-green' />
//         {price && discount && (
//           <PriceFormatter amount={price + (discount * price) / 100 }
//           className="line-through text-sm pl-4 font-medium text-shopLightText"  />
//         )}
//       </div>
//     </>
//   )
// }

// export default PriceView









import PriceFormatter from "./priceFormatter";

interface Props {
  price: number | undefined;
  discount?: number;
  className?: string;
}

const PriceView = ({ price, discount = 0, className = "" }: Props) => {
  if (price === undefined || !Number.isFinite(Number(price))) return null;

  const regularPrice = Number(price);
  const discountPercent = Math.min(100, Math.max(0, Number(discount) || 0));
  const hasDiscount = discountPercent > 0;
  const discountedPrice = hasDiscount
    ? Math.round(regularPrice * (1 - discountPercent / 100) * 100) / 100
    : regularPrice;

  return (
    <div className="flex items-center gap-3">
      <PriceFormatter
        amount={discountedPrice}
        className={className || "text-shop-dark-green text-lg font-semibold"}
      />

      {hasDiscount && (
        <PriceFormatter
          amount={regularPrice}
          className="text-sm font-medium line-through text-shopLightText"
        />
      )}
    </div>
  );
};

export default PriceView;
