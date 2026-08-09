"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import useStore from "@/store";

const CartIcon = () => {
  const itemCount = useStore((state) =>
    state.items.reduce((total, item) => total + (Number(item.quantity) || 0), 0),
  );

  return (
    <>
      <Link href="/shop/cart" className="group relative">
        <ShoppingBag className="h-5 w-5 hover:text-shop-light-green hoverEffect" />
        {itemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-shop-dark-green text-xs font-bold text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Link>
    </>
  );
};

export default CartIcon
