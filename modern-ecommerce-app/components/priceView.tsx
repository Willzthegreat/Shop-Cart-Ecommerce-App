import React from 'react'
import PriceFormatter from './priceFormatter';


interface Props {
    price: number | undefined;
    discount: number | undefined;
    className: string;
}


const PriceView = ({ price, discount, className }: Props) => {
  return (
    <>
      <div>
        <PriceFormatter amount={price} className='text-shop-dark-green' />
      </div>
    </>
  )
}

export default PriceView
