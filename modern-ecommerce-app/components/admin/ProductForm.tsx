"use client";

import { FormEvent, useState } from "react";

type Option = { _id: string; title: string };

export default function ProductForm({ categories, brands }: { categories: Option[]; brands: Option[] }) {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const images = String(form.get("images") || "").split(",").map((item) => item.trim()).filter(Boolean);
    const payload = { ...Object.fromEntries(form), images, isFeatured: form.get("isFeatured") === "true" };
    setMessage("Saving product...");
    const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    setMessage(response.ok ? "Product saved to MongoDB." : result.error || "Could not save product.");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">Add product</h2>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <input name="name" required placeholder="Product name" className="rounded border p-3" />
        <input name="code" placeholder="Product code" className="rounded border p-3" />
        <textarea name="description" placeholder="Description" className="rounded border p-3" />
        <input name="images" placeholder="Image URLs, separated by commas" className="rounded border p-3" />
        <div className="grid gap-3 sm:grid-cols-2"><input name="price" required type="number" min="0" placeholder="Price" className="rounded border p-3" /><input name="discount" type="number" min="0" placeholder="Discount" className="rounded border p-3" /></div>
        <div className="grid gap-3 sm:grid-cols-2"><input name="stock" type="number" min="0" placeholder="Stock" className="rounded border p-3" /><select name="status" className="rounded border p-3"><option value="new">New</option><option value="hot">Hot</option><option value="sale">Sale</option></select></div>
        <select name="category" required className="rounded border p-3"><option value="">Select category</option>{categories.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}</select>
        <select name="brand" required className="rounded border p-3"><option value="">Select brand</option>{brands.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}</select>
        <label className="flex gap-2 text-sm"><input name="isFeatured" type="checkbox" value="true" /> Featured product</label>
        <button className="w-fit rounded bg-shop-dark-green px-5 py-3 font-semibold text-white">Save product</button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </section>
  );
}
