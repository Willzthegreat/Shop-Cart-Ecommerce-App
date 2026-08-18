// "use client";

// import { FormEvent, useState } from "react";


// // interface Props {
// //   categories: string;
// //   brands: string[];
// // }

// type Option = { _id: string; title: string };

// export default function ProductForm({ categories, brands }: { categories: Option[]; brands: Option[] } ) {
//   const [message, setMessage] = useState("");

//   async function submit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const form = new FormData(event.currentTarget);
//     setMessage("Saving product...");
//     const response = await fetch("/api/products", {
//       method: "POST",
//       body: form,
//     });
//     const result = await response.json();
//     setMessage(response.ok ? "Product saved to MongoDB." : result.error || "Could not save product.");
//     if (response.ok) event.currentTarget.reset();
//   }

//   return (
//     <section className="rounded-xl border bg-white p-6 shadow-sm w-60 md:w-min-x-80">
//       <h2 className="text-xl font-bold text-gray-800">Add product</h2>
//       <form onSubmit={submit} className="mt-4 grid gap-3">
//         <input name="name" required placeholder="Product name" className="rounded border p-3 w-20" />
//         <input name="code" placeholder="Product code" className="rounded border p-3 w-20" />
//         <textarea name="description" placeholder="Description" className="rounded border p-3 w-20 md:min-w-md" />
//         <label className="grid gap-1 text-sm font-medium text-gray-700">
//           Online image URL(s)
//           <input
//             name="images"
//             placeholder="https://example.com/image.jpg (comma-separated)"
//             className="rounded border p-3 font-normal w-20"
//           />
//         </label>
//         <label className="grid gap-1 text-sm font-medium text-gray-700">
//           Or upload an image
//           <input
//             name="imageFiles"
//             type="file"
//             multiple
//             accept="image/png,image/jpeg,image/webp,image/gif"
//             className="cursor-pointer rounded border p-3 font-normal w-20"
//           />
//         </label>
//         <div className="grid gap-3 sm:grid-cols-2">
//           <label className="grid gap-1 text-sm font-medium text-gray-700">
//             Original price
//             <input name="price" required type="number" min="0" step="0.01" placeholder="Price before discount" className="rounded border w-20 p-3 font-normal" />
//           </label>
//           <label className="grid gap-1 text-sm font-medium text-gray-700">
//             Original / discount price
//             <input name="discount" type="number" min="0" step="0.01" placeholder="e.g. 460" className="rounded border p-3 font-normal w-20" />
//           </label>
//         </div>
//         <div className="grid gap-3 sm:grid-cols-2"><input name="stock" type="number" min="0" placeholder="Stock" className="rounded border p-3" /><select name="status" className="rounded border p-3"><option value="new">New</option><option value="hot">Hot</option><option value="sale">Sale</option></select></div>
//         <select name="category" required className="rounded border p-3"><option value="">Select category</option>{categories.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}</select>
//         <select name="brand" required className="rounded border p-3"><option value="">Select brand</option>{brands.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}</select>
//         <label className="flex gap-2 text-sm"><input name="isFeatured" type="checkbox" value="true" /> Featured product</label>
//         <button className="w-fit rounded bg-shop-dark-green px-5 py-3 font-semibold text-white">Save product</button>
//         {message && <p className="text-sm text-gray-600">{message}</p>}
//       </form>
//     </section>
//   );
// }
























"use client";

import { FormEvent, useEffect, useState } from "react";

type Option = {
  _id: string;
  title: string;
};

interface ProductFormProps {
  categories: Option[];
  brands: Option[];
  onProductSaved?: () => void;
}

export default function ProductForm({
  categories,
  brands,
  onProductSaved,
}: ProductFormProps) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [availableCategories, setAvailableCategories] =
    useState<Option[]>(categories);
  const [availableBrands, setAvailableBrands] = useState<Option[]>(brands);

  useEffect(() => {
    setAvailableCategories(categories);
  }, [categories]);

  useEffect(() => {
    setAvailableBrands(brands);
  }, [brands]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setSaving(true);
    setMessage("Saving product...");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: new FormData(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error || "Could not save product."
        );
        return;
      }

      setMessage("Product saved successfully.");
      form.reset();
      onProductSaved?.();
    } catch {
      setMessage(
        "Could not save product. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return isOpen ? (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close product form"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={() => setIsOpen(false)}
      />

      <section className="relative z-101 max-h-[92vh] w-full max-w-2xl min-w-0 overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">

      {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Add Product
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a new product to your store.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close product form"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <i className="bx bx-x text-xl" />
          </button>
        </div>

      <form
        onSubmit={submit}
        className="grid min-w-0 gap-4"
      >

        {/* Product Name */}
        <label className="grid gap-1.5 text-sm font-medium text-gray-700">
          Product Name

          <input
            name="name"
            required
            placeholder="e.g. Nike Air Max"
            className="w-full rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
          />
        </label>


        {/* Product Code */}
        <label className="grid gap-1.5 text-sm font-medium text-gray-700">
          Product Code

          <input
            name="code"
            placeholder="e.g. NIK-AM-001"
            className="w-full rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
          />
        </label>


        {/* Description */}
        <label className="grid gap-1.5 text-sm font-medium text-gray-700">
          Description

          <textarea
            name="description"
            rows={4}
            placeholder="Describe your product..."
            className="w-full resize-none rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
          />
        </label>


        {/* Image URL */}
        <label className="grid gap-1.5 text-sm font-medium text-gray-700">
          Online Image URL(s)

          <input
            name="images"
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
          />

          <span className="text-xs font-normal text-gray-400">
            Separate multiple image URLs with commas.
          </span>
        </label>


        {/* Image Upload */}
        <label className="grid gap-1.5 text-sm font-medium text-gray-700">
          Upload Product Images

          <input
            name="imageFiles"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="w-full cursor-pointer rounded-md border border-gray-200 p-2.5 text-sm font-normal text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-medium"
          />
        </label>


        {/* Price */}
        <div className="grid gap-4 sm:grid-cols-2">

          <label className="grid gap-1.5 text-sm font-medium text-gray-700">
            Original Price

            <input
              name="price"
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 50000"
              className="w-full rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
            />
          </label>


          <label className="grid gap-1.5 text-sm font-medium text-gray-700">
            Discount Price

            <input
              name="discount"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 45000"
              className="w-full rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
            />
          </label>

        </div>


        {/* Stock & Status */}
        <div className="grid gap-4 sm:grid-cols-2">

          <label className="grid gap-1.5 text-sm font-medium text-gray-700">
            Stock

            <input
              name="stock"
              type="number"
              min="0"
              placeholder="e.g. 100"
              className="w-full rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
            />
          </label>


          <label className="grid gap-1.5 text-sm font-medium text-gray-700">
            Status

            <select
              name="status"
              className="w-full rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
            >
              <option value="new">New</option>
              <option value="hot">Hot</option>
              <option value="sale">Sale</option>
            </select>
          </label>

        </div>


        {/* Category */}
        <label className="grid gap-1.5 text-sm font-medium text-gray-700">
          Category

          <select
            name="category"
            required
            className="w-full rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
          >
            <option value="">
              Select category
            </option>

            {availableCategories.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.title}
              </option>
            ))}
          </select>
        </label>


        {/* Brand */}
        <label className="grid gap-1.5 text-sm font-medium text-gray-700">
          Brand

          <select
            name="brand"
            required
            className="w-full rounded-md border border-gray-200 p-3 text-sm font-normal outline-none transition focus:border-shop-light-green focus:ring-1 focus:ring-shop-light-green"
          >
            <option value="">
              Select brand
            </option>

            {availableBrands.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.title}
              </option>
            ))}
          </select>
        </label>


        {/* Featured */}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            name="isFeatured"
            type="checkbox"
            value="true"
            className="h-4 w-4 rounded border-gray-300 accent-shop-light-green"
          />

          <span>
            Featured product
          </span>
        </label>


        {/* Submit */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-shop-dark-green px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
          >
            {saving ? (
              <>
                <i className="bx bx-loader-alt animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <i className="bx bx-plus" />
                Save Product
              </>
            )}
          </button>

          {message && (
            <p
              className={`text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : message.toLowerCase().includes("saving")
                  ? "text-gray-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

        </div>

      </form>
      </section>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="flex min-h-20 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-shop-light-green hover:shadow-md"
    >
      <span>
        <span className="flex items-center gap-2 text-base font-semibold text-gray-800">
          <i className="bx bx-plus-circle text-xl text-shop-dark-green" />
          Add Product
        </span>
        <span className="mt-1 block text-sm text-gray-500">
          Click to open the product upload form.
        </span>
      </span>
      <i className="bx bx-expand-alt text-xl text-gray-400" />
    </button>
  );
}
