// "use client";

// import { FormEvent, useEffect, useState } from "react";

// type Brand = { _id: string; title: string; slug: string; logo?: string };

// export default function ImageUpLoader({ initialBrands = [] }: { initialBrands?: Brand[] }) {
//   const [brands, setBrands] = useState<Brand[]>(initialBrands);
//   const [message, setMessage] = useState("");
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     setBrands(initialBrands);
//   }, [initialBrands]);

//   useEffect(() => {
//     let mounted = true;

//     fetch("/api/brands", { cache: "no-store", credentials: "include" })
//       .then(async (response) => {
//         if (!response.ok) return null;
//         return (await response.json()) as Brand[];
//       })
//       .then((sellerBrands) => {
//         if (mounted && sellerBrands) setBrands(sellerBrands);
//       })
//       .catch(() => {
//         // Keep the server-provided brands when the refresh request fails.
//       });

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   async function submit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const form = event.currentTarget;
//     setMessage("Uploading…");
//     setUploading(true);

//     try {
//       const response = await fetch("/api/brands", {
//         method: "POST",
//         body: new FormData(form),
//       });
//       const result = (await response.json()) as Brand & { error?: string };

//       if (!response.ok) {
//         setMessage(result.error || "Upload failed.");
//         return;
//       }

//       setMessage("Brand saved.");
//       setBrands((current) =>
//         [...current.filter((brand) => brand._id !== result._id), result].sort(
//           (a, b) => a.title.localeCompare(b.title),
//         ),
//       );
//       form.reset();
//     } catch {
//       setMessage("Upload failed. Please check your connection and try again.");
//     } finally {
//       setUploading(false);
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Brands of products the seller has uploaded already */}
//       <div className="flex max-w-full gap-4 overflow-x-auto pb-2">
//         {brands.map((brand) => (
//           <div key={brand._id} className="w-32 shrink-0 rounded border bg-white p-3">
//             <div className="relative aspect-square overflow-hidden rounded bg-gray-100">
//               {brand.logo ? (
//                 <img
//                   src={brand.logo}
//                   alt={`${brand.title} logo`}
//                   className="h-full w-full object-contain p-2"
//                 />
//               ) : (
//                 <div className="flex h-full items-center justify-center text-sm text-gray-500">
//                   No logo
//                 </div>
//               )}
//             </div>
//             <p className="mt-2 truncate text-center text-sm font-medium text-gray-700">
//               {brand.title}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Brand Upload Form */}
//       <form onSubmit={submit} className="flex max-w-full justify-center items-center text-center px-4 gap-3">
//         <div className="flex flex-col justify-start">
//           <input name="title" required placeholder="Brand name" className=" my-6 rounded border p-2 w-auto md:max-w-lg" />
//           <input name="logo" className="cursor-pointer hover:text-gray-500 text-center" required type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
//         </div>
//         <button disabled={uploading} type="submit" className="rounded bg-shop-dark-green cursor-pointer px-4 py-1 text-[10px] text-white disabled:cursor-not-allowed disabled:opacity-60">
//           {uploading ? "Uploading…" : "Upload brand"}
//         </button>
//         {message && <p className="text-sm">{message}</p>}
//       </form>
      
//     </div>
//   );
// }
















"use client";

import { FormEvent, useEffect, useState } from "react";

type Brand = {
  _id: string;
  title: string;
  slug: string;
  logo?: string;
};

interface ImageUpLoaderProps {
  initialBrands?: Brand[];
}

export default function ImageUpLoader({
  initialBrands = [],
}: ImageUpLoaderProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setBrands(initialBrands);
  }, [initialBrands]);

  useEffect(() => {
    let mounted = true;

    async function loadBrands() {
      try {
        const response = await fetch("/api/brands", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) return;

        const sellerBrands =
          (await response.json()) as Brand[];

        if (mounted) {
          setBrands(sellerBrands);
        }
      } catch {
        // Keep initial brands if fetching fails.
      }
    }

    loadBrands();

    return () => {
      mounted = false;
    };
  }, []);

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        body: new FormData(form),
        credentials: "include",
      });

      const result =
        (await response.json()) as Brand & {
          error?: string;
        };

      if (!response.ok) {
        setMessage(
          result.error || "Upload failed."
        );
        return;
      }

      setBrands((current) =>
        [
          ...current.filter(
            (brand) => brand._id !== result._id
          ),
          result,
        ].sort((a, b) =>
          a.title.localeCompare(b.title)
        )
      );

      setMessage("Brand saved successfully.");

      form.reset();
    } catch {
      setMessage(
        "Upload failed. Please check your connection and try again."
      );
    } finally {
      setUploading(false);
    }
  }

  return isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close brand uploader"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative z-[101] max-h-[92vh] w-full max-w-2xl min-w-0 overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Manage Brands</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a brand that can be assigned to your products.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close brand uploader"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <i className="bx bx-x text-xl" />
          </button>
        </div>

        <div className="min-w-0 space-y-6">

      {/* =========================================
          BRAND LIST
      ========================================== */}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Your Brands
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Brands available for your products.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
            {brands.length}
          </span>
        </div>

        {brands.length > 0 ? (
          <div className="flex max-w-full gap-3 overflow-x-auto pb-2">
            {brands.map((brand) => (
              <div
                key={brand._id}
                className="w-28 shrink-0 rounded-lg border border-gray-200 bg-white p-2"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={`${brand.title} logo`}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      No logo
                    </div>
                  )}
                </div>

                <p className="mt-2 truncate text-center text-xs font-medium text-gray-700">
                  {brand.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
            <i className="bx bx-store-alt text-3xl text-gray-300" />

            <p className="mt-2 text-sm text-gray-500">
              No brands added yet.
            </p>
          </div>
        )}
      </div>


      {/* =========================================
          BRAND UPLOAD
      ========================================== */}

      <div className="border-t border-gray-200 pt-5">
        <h3 className="text-sm font-semibold text-gray-900">
          Add Brand
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Add a brand that can be assigned to your products.
        </p>

        <form
          onSubmit={submit}
          className="mt-4 space-y-4"
        >

          {/* Brand Name */}
          <div>
            <label
              htmlFor="brand-title"
              className="mb-1 block text-xs font-medium text-gray-600"
            >
              Brand Name
            </label>

            <input
              id="brand-title"
              name="title"
              required
              placeholder="e.g. Nike"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-shop-light-green"
            />
          </div>


          {/* Brand Logo */}
          <div>
            <label
              htmlFor="brand-logo"
              className="mb-1 block text-xs font-medium text-gray-600"
            >
              Brand Logo
            </label>

            <input
              id="brand-logo"
              name="logo"
              required
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="block w-full cursor-pointer rounded-md border border-gray-200 text-sm text-gray-500 file:mr-3 file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-medium"
            />
          </div>


          {/* Submit */}
          <button
            disabled={uploading}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-shop-dark-green px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <i className="bx bx-loader-alt animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <i className="bx bx-upload" />
                Upload Brand
              </>
            )}
          </button>


          {/* Message */}
          {message && (
            <p
              className={`text-center text-xs ${
                message.toLowerCase().includes("failed")
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

        </form>
      </div>

        </div>
      </div>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="flex min-h-20 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-shop-light-green hover:shadow-md"
    >
      <span>
        <span className="flex items-center gap-2 text-base font-semibold text-gray-800">
          <i className="bx bx-store-alt text-xl text-shop-dark-green" />
          Add Brand
        </span>
        <span className="mt-1 block text-sm text-gray-500">
          Click to manage brands and upload a logo.
        </span>
      </span>
      <i className="bx bx-expand-alt text-xl text-gray-400" />
    </button>
  );
}
