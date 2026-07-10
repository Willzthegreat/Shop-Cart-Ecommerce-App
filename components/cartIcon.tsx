import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CartIcon = () => {
  return (
    <>
      <Link href="/cart" className="group relative">
        <ShoppingBag className='w-5 h-5 hover:text-shop-light-green hoverEffect' />
        <span className="absolute -top-2 -right-2 bg-shop-dark-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          0
        </span>
      </Link>
    </>
  )
}

export default CartIcon
