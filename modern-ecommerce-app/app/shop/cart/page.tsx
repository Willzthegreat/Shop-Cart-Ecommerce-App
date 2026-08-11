"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import PriceFormatter from "@/components/priceFormatter";
import useStore from "@/store";
import { resolveProductImage } from "@/lib/productImage";
import NoAccess from "@/components/noAccess";
import Container from "@/components/container";
import EmptyCart from "@/components/emptyCart";
import FavoriteButton from "@/components/favoriteButton";

interface StoredUser {
  name?: string;
  email?: string;
}

export default function CartPage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const items = useStore((state) => state.items);
  const addItem = useStore((state) => state.addItem);
  const removeItem = useStore((state) => state.removeItem);
  const deleteItem = useStore((state) => state.delectCartProduct);
  const subtotal = useStore((state) => state.getSubTotalPrice());
  const discount = items.reduce((total, { product, quantity }) => {
    const price = Number(product.price) || 0;
    const originalPrice = Number(product.discount) || 0;
    const saving = originalPrice > price ? originalPrice - price : 0;
    return total + saving * quantity;
  }, 0);
  const total = subtotal;

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

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
   
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {user ? (
        <>
          <Container>
            {items.length ? <>
              <h1 className="text-2xl font-bold sm:text-3xl">Shopping Cart</h1>
              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4 overflow-hidden">
                  {items.map(({ product, quantity }) => (
                    <div key={product._id} className="flex flex-col gap-4 rounded-lg border justify-between bg-white p-4 sm:flex-row sm:items-center">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={resolveProductImage(product.images?.[0])}
                          alt={product.name}
                          fill
                          sizes="96px"
                          className={`object-contain ${product.stock === 0 ? "opacity-50" : ""}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h2 className="truncate font-semibold mb-4">{product.name}</h2>
                        <div className="flex flex-wrap items-center gap-3">
                          <PriceFormatter amount={product.price} className="text-shop-dark-green" />
                          <FavoriteButton size="small" showProduct={true} product={product} />
                        </div>
                      
                      
                      </div>
                      <div className="flex items-center justify-between gap-2 sm:justify-start">
                        <button type="button" aria-label="Decrease quantity" onClick={() => removeItem(product._id)} className="rounded border p-1">
                          <Minus size={15} />
                        </button>
                        <span className="w-6 text-center">{quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => addItem(product)}
                          disabled={Number.isFinite(Number(product.stock)) && quantity >= Number(product.stock)}
                          className="rounded border p-1 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <button type="button" aria-label={`Remove ${product.name}`} onClick={() => deleteItem(product._id)} className="text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <aside >
                  <div className="h-fit rounded-lg border bg-white p-5">
                    <h2 className="font-semibold">Order Summary</h2>
                    <div className="mt-4 flex justify-between border-t pt-4 font-bold">
                      <span>Subtotal</span>
                      <PriceFormatter amount={subtotal} />
                    </div>
                    <div className="mt-4 flex justify-between pt-4 font-bold">
                      <span>Discount</span>
                      <PriceFormatter amount={discount} />
                    </div>
                    <div className="mt-4 flex justify-between pt-4 font-bold">
                      <span>Total</span>
                      <PriceFormatter amount={total} />
                    </div>
                  </div>
                  <div className="h-fit rounded-lg border mt-8 bg-white p-5">
                    <h2 className="font-semibold">Delivery Address</h2>
                    {user ? (
                      <div className="mt-3 rounded border border-gray-200 p-3 text-sm">
                        <p className="font-semibold">{user.name || "Customer"}</p>
                        <p className="text-gray-500">{user.email || "No email available"}</p>
                        <Link href="/shop/profile" className="mt-3 inline-block font-semibold text-shop-dark-green hover:underline">
                          Manage delivery details
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Sign in to use your saved delivery details.</p>
                        
                        <Link href="/?auth=required" className="font-semibold text-shop-dark-green hover:underline">
                          Sign in
                        </Link>
                        
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            </> : <EmptyCart />}
          </Container>  
        </>
      ) : (
        <NoAccess />
      )}
    </main>
    </>
  );
}
