"use client";

import { FormEvent, useState } from "react";

export default function BlogUploader() {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage("Saving blog...");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        body: new FormData(form),
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Could not save the blog.");
        return;
      }

      form.reset();
      setMessage("Blog saved. It is now visible on the blog page and Latest Blog section.");
    } catch {
      setMessage("Could not connect to the server.");
    }
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">Upload Blog</h2>
      <p className="mt-1 text-sm text-gray-500">
        Publish a blog post to MongoDB and display it across the storefront.
      </p>

      <form onSubmit={submit} className="mt-5 grid gap-4">
        <input
          name="title"
          required
          placeholder="Blog title"
          className="rounded border p-3 "
        />
        <input
          name="author"
          required
          placeholder="Author name"
          className="rounded border p-3"
        />
        <textarea
          name="body"
          required
          rows={8}
          placeholder="Write your blog content..."
          className="rounded border p-3"
        />
        <input
          name="mainImage"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="cursor-pointer rounded border p-3"
        />
        <button
          type="submit"
          className="w-fit rounded bg-shop-dark-green px-5 py-3 font-semibold text-white"
        >
          Publish blog
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </section>
  );
}
