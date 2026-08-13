import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const EmptyCart = ({
  title = "Your cart is empty",
  description = "Browse our products and add something you love to your cart.",
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-5 rounded-full bg-gray-100 p-5 text-shop-dark-green">
        <ShoppingCart size={42} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500 sm:text-base">
        {description}
      </p>
      <Link
        href="/store"
        className="mt-6 rounded bg-shop-dark-green px-5 py-3 font-medium text-white transition hover:opacity-90"
      >
        Continue shopping
      </Link>
    </div>
  )
}

export default EmptyCart
