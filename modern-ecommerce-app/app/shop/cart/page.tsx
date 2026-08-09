"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import PriceFormatter from "@/components/priceFormatter";
import useStore from "@/store";

export default function CartPage() {
  const items = useStore((state) => state.items);
  const addItem = useStore((state) => state.addItem);
  const removeItem = useStore((state) => state.removeItem);
  const deleteItem = useStore((state) => state.delectCartProduct);
  const subtotal = useStore((state) => state.getSubTotalPrice());

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/store" className="mt-5 inline-block rounded bg-shop-dark-green px-5 py-3 text-white">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">Shopping Cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="flex flex-col gap-4 rounded-lg border bg-white p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold">{product.name}</h2>
                <PriceFormatter amount={product.price} className="text-shop-dark-green" />
              </div>
              <div className="flex items-center justify-between gap-2 sm:justify-start">
                <button aria-label="Decrease quantity" onClick={() => removeItem(product._id)} className="rounded border p-1">
                  <Minus size={15} />
                </button>
                <span className="w-6 text-center">{quantity}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => addItem(product)}
                  disabled={Number.isFinite(Number(product.stock)) && quantity >= Number(product.stock)}
                  className="rounded border p-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={15} />
                </button>
              </div>
              <button aria-label={`Remove ${product.name}`} onClick={() => deleteItem(product._id)} className="text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="mt-4 flex justify-between border-t pt-4 font-bold">
            <span>Subtotal</span>
            <PriceFormatter amount={subtotal} />
          </div>
        </aside>
      </div>
    </main>
  );
}
