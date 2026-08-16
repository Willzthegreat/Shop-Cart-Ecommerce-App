"use client";

// import Image from "next/image";
import { FormEvent, useState } from "react";

type Brand = { _id: string; title: string; slug: string; logo?: string };

export default function ImageUpLoader({ initialBrands = [] }: { initialBrands?: Brand[] }) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage("Uploading...");

    const response = await fetch("/api/brands", {
      method: "POST",
      body: new FormData(form),
    });
    const result = await response.json();

    setMessage(response.ok ? "Brand saved." : result.error || "Upload failed.");
    if (response.ok) {
      setBrands((current) => [
        ...current.filter((brand) => brand._id !== result._id),
        result,
      ].sort((a, b) => a.title.localeCompare(b.title)));
      form.reset();
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="flex max-w-full justify-center items-center text-center flex-col gap-3">
        <input name="title" required placeholder="Brand name" className=" my-6 rounded border p-2 w-auto md:min-w-md" />
        <input name="logo" className="cursor-pointer hover:text-gray-500 text-center pl-40" required type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
        <button type="submit" className="rounded bg-shop-dark-green cursor-pointer px-4 py-2 text-white">
          Upload brand
        </button>
        {message && <p className="text-sm">{message}</p>}
      </form>

      {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {brands.map((brand) => (
          <div key={brand._id} className="rounded border bg-white p-3 text-center">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.title} className="mx-auto h-16 w-full object-contain" />
            ) : (
              <div className="flex h-16 items-center justify-center bg-gray-100 text-sm text-gray-500">
                No logo
              </div>
            )}
            <p className="mt-2 text-sm font-semibold">{brand.title}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}
