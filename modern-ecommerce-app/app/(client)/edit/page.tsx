"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Product = {
  name: string;
  description?: string;
  price: number;
  discount: number;
  stock: number;
  status: "new" | "hot" | "sale";
  category?: { title: string } | null;
  brand?: { title: string } | null;
};

function EditProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("Loading product...");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!productId) {
      setMessage("No product was selected.");
      return;
    }

    fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
      cache: "no-store",
      credentials: "include",
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.data) throw new Error(result.error || "Product not found.");
        setProduct(result.data);
        setMessage("");
      })
      .catch((error) => setMessage(error.message));
  }, [productId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!productId) return;

    setSaving(true);
    setMessage("Saving changes...");
    const values = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update product.");
      setMessage("Product updated successfully.");
      setProduct(result.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update product.");
    } finally {
      setSaving(false);
    }
  }

  if (!product) return <main className="mx-auto max-w-2xl p-6">{message}</main>;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <button type="button" onClick={() => router.back()} className="mb-5 text-sm text-gray-600 hover:text-gray-900">
        ← Back to products
      </button>
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Category: {product.category?.title || "—"} · Brand: {product.brand?.title || "—"}
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input name="name" defaultValue={product.name} required placeholder="Product name" className="rounded-md border p-3" />
          <textarea name="description" defaultValue={product.description} placeholder="Description" className="rounded-md border p-3" />
          <div className="grid gap-4 sm:grid-cols-3">
            <input name="price" type="number" min="0" step="0.01" defaultValue={product.price} required className="rounded-md border p-3" />
            <input name="discount" type="number" min="0" step="0.01" defaultValue={product.discount} className="rounded-md border p-3" />
            <input name="stock" type="number" min="0" defaultValue={product.stock} className="rounded-md border p-3" />
          </div>
          <select name="status" defaultValue={product.status} className="rounded-md border p-3">
            <option value="new">New</option>
            <option value="hot">Hot</option>
            <option value="sale">Sale</option>
          </select>
          <button disabled={saving} className="rounded-md bg-shop-dark-green px-5 py-3 font-semibold text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </form>
      </section>
    </main>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-2xl p-6">Loading editor...</main>}>
      <EditProductContent />
    </Suspense>
  );
}
