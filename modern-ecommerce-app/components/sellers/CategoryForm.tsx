"use client";

import { FormEvent, useState } from "react";

export default function CategoryForm() {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("Saving category...");
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const result = await response.json();
    setMessage(response.ok ? "Category saved to MongoDB." : result.message || result.error || "Could not save category.");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">Add category</h2>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <input name="title" required placeholder="Category name" className="rounded border p-3" />
        <textarea name="description" placeholder="Description" className="rounded border p-3" />
        <input name="image" placeholder="Image URL (optional)" className="rounded border p-3" />
        <label className="flex gap-2 text-sm"><input name="featured" type="checkbox" value="true" /> Featured category</label>
        <button className="w-fit rounded bg-shop-dark-green px-5 py-3 font-semibold text-white">Save category</button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </section>
  );
}
