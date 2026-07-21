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
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price, discount = 0, className = "" }: Props) => {
  if (price === undefined) return null;

  // Calculate original price
  // The database price is the current price. Reconstruct the crossed-out
  // price from the stored percentage discount.
  const originalPrice = discount > 0 ? price * (1 + discount / 100) : null;

  return (
    <div className="flex items-center gap-3">
      <PriceFormatter
        amount={price}
        className={className || "text-shop-dark-green text-lg font-semibold"}
      />

      {originalPrice && (
        <PriceFormatter
          amount={Math.round(originalPrice * 100) / 100}
          className="text-sm font-medium line-through text-shopLightText"
        />
      )}
    </div>
  );
};

export default PriceView;
