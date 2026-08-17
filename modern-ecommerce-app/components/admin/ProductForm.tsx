"use client";

import { FormEvent, useState } from "react";


// interface Props {
//   categories: string;
//   brands: string[];
// }

type Option = { _id: string; title: string };

export default function ProductForm({ categories, brands }: { categories: Option[]; brands: Option[] } ) {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("Saving product...");
    const response = await fetch("/api/products", {
      method: "POST",
      body: form,
    });
    const result = await response.json();
    setMessage(response.ok ? "Product saved to MongoDB." : result.error || "Could not save product.");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm w-60 md:w-min-x-80">
      <h2 className="text-xl font-bold text-gray-800">Add product</h2>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <input name="name" required placeholder="Product name" className="rounded border p-3 w-20" />
        <input name="code" placeholder="Product code" className="rounded border p-3 w-20" />
        <textarea name="description" placeholder="Description" className="rounded border p-3 w-20 md:min-w-md" />
        <label className="grid gap-1 text-sm font-medium text-gray-700">
          Online image URL(s)
          <input
            name="images"
            placeholder="https://example.com/image.jpg (comma-separated)"
            className="rounded border p-3 font-normal w-20"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-gray-700">
          Or upload an image
          <input
            name="imageFiles"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="cursor-pointer rounded border p-3 font-normal w-20"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Original price
            <input name="price" required type="number" min="0" step="0.01" placeholder="Price before discount" className="rounded border w-20 p-3 font-normal" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Original / discount price
            <input name="discount" type="number" min="0" step="0.01" placeholder="e.g. 460" className="rounded border p-3 font-normal w-20" />
          </label>
        </div>
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
