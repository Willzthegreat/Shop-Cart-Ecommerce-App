"use client";

import { useEffect, useState } from "react";
import Container from "@/components/container";
import EmptyCart from "@/components/emptyCart";
import NoAccess from "@/components/noAccess";
import AddToCartButton from "@/components/addToCart";
import PriceView from "@/components/priceView";
import { resolveProductImage } from "@/lib/productImage";
import useStore from "@/store";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

interface StoredUser {
  name?: string;
  email?: string;
}

export default function WishlistPage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(savedUser) as StoredUser);
      } catch {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("userChanged", loadUser);
    return () => window.removeEventListener("userChanged", loadUser);
  }, []);

  if (!user) {
    return <NoAccess details="Sign in to view your wishlist." />;
  }

  if (favoriteProduct.length === 0) {
    return (
      <EmptyCart
        title="Your wishlist is empty"
        description="Log in to view your wishlist items. Don't miss out on your cart products to make the payment!"
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <Container>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold sm:text-3xl">My Wishlist</h1>
          <button
            type="button"
            onClick={resetFavorite}
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            Remove all
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full min-w-190 border-collapse">
            <thead className="border-b">
              <tr className="bg-black/5 text-sm">
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {favoriteProduct.slice(0, visibleProducts).map((product) => {
                const category = typeof product.category === "string"
                  ? product.category
                  : product.category?.title || "General";
                const type = typeof product.brand === "string"
                  ? product.brand
                  : product.brand?.title || "Product";

                return (
                  <tr key={product._id} className="border-b last:border-b-0">
                    <td className="p-4">
                      <Link href={`/product/${product.slug}`} className="flex items-center gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={resolveProductImage(product.images?.[0])}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <span className="min-w-40 font-semibold hover:text-shop-dark-green">
                          {product.name}
                        </span>
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{category}</td>
                    <td className="p-4 text-sm text-gray-600">{type}</td>
                    <td className="p-4 text-sm capitalize">
                      <span className={product.stock && product.stock > 0 ? "text-green-600" : "text-red-600"}>
                        {product.stock && product.stock > 0 ? product.status || "Available" : "Out of stock"}
                      </span>
                    </td>
                    <td className="p-4">
                      <PriceView price={product.price} discount={product.discount} />
                    </td>
                    <td className="p-4">
                      <div className="flex min-w-36 items-center gap-2">
                        <AddToCartButton product={product} className="py-3" />
                        <button
                          type="button"
                          aria-label={`Remove ${product.name} from wishlist`}
                          onClick={() => removeFromFavorite(product._id)}
                          className="rounded border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visibleProducts < favoriteProduct.length && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={loadMore}
              className="rounded bg-shop-dark-green px-5 w-170 py-1 font-medium text-white transition hover:opacity-90"
            >
              Load more
            </button>
          </div>
        )}
      </Container>
    </main>
  );
}
