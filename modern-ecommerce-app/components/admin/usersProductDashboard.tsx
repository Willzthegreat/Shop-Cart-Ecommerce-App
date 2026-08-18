// "use client";

// import ImageUpLoader from './ImageUpLoader'
// import ProductForm from './ProductForm'

// type Option = { _id: string; title: string };
// type Brand = Option & { slug: string; logo?: string };

// interface UsersProductDashboardProps {
//   brands: Brand[];
//   categories: Option[];
// }

// const UsersProductDashboard = ({
//   brands,
//   categories,
// }: UsersProductDashboardProps) => {
//   return (
//     <>
//       <div>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {/* Total Product */}
//           <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
//             <div className="flex items-center justify-start p-4 ">
//               <i className="bx bxs-shopping-bag-alt text-[20px] text-shop-light-green pr-2"></i>
//               <h2 className="text-sm font-semibold text-gray-400">
//                 Total Product
//               </h2>
//             </div>
//             <div className="flex py-2 px-4 justify-between">
//               <p className="text-sm font-semibold ">4,300</p>
//             </div>
//           </div>

//           {/* Total Stock */}

//           <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
//             <div className="flex items-center justify-start p-4 ">
//               <i className="bx bxs-bolt-circle pr-2 text-[20px] text-shop-light-green"></i>
//               <h2 className="text-sm font-semibold text-gray-400">
//                 Total Orders
//               </h2>
//             </div>
//             <div className="flex py-2 px-4 justify-between">
//               <div className="text-right">
//                 <p className="text-sm font-semibold ">18,600</p>
//               </div>
//             </div>
//           </div>

//           {/* Total Sold */}

//           <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
//             <div className="flex items-center justify-start p-4 ">
//               <i className="bx bx-dollar rounded-sm text-[9px] bg-shop-light-green p-1 mr-2 text-sm text-white"></i>
//               <h2 className="text-sm font-semibold text-gray-400">
//                 Total Sold
//               </h2>
//             </div>
//             <div className="flex py-2 px-4 justify-between">
//               <div className="text-right">
//                 <p className="text-sm font-semibold ">12,760</p>
//               </div>
//             </div>
//           </div>

//           {/* Total Categories */}

//           <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
//             <div className="flex items-center justify-start p-4 ">
//               <i className="bx bx-category-alt rounded-sm bg-shop-light-green text-[9px] mr-2 p-1 text-sm text-white"></i>
//               <h2 className="text-sm font-semibold text-gray-400">
//                 Total Categories
//               </h2>
//             </div>
//             <div className="flex py-2 px-4 justify-between">
//               <div className="text-right">
//                 <p className="text-sm font-semibold ">12,760</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-2">
//         <div>
//           <ImageUpLoader initialBrands={brands} />
//         </div>
//         <div>
//           <ProductForm categories={categories} brands={brands} />
//         </div>
//       </div>



//     </>
//   );
// };

// export default UsersProductDashboard;



















"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpLoader from "./ImageUpLoader";
import ProductForm from "./ProductForm";
import { resolveProductImage } from "@/lib/productImage";

type Option = {
  _id: string;
  title: string;
};

type Brand = Option & {
  slug: string;
  logo?: string;
};

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  category?: Option | null;
  brand?: Brand | null;
  image?: string;
}

interface UsersProductDashboardProps {
  brands: Brand[];
  categories: Option[];
  products?: Product[];
}

const UsersProductDashboard = ({
  brands,
  categories,
  products = [],
}: UsersProductDashboardProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        product.category?._id === categoryFilter;

      const matchesBrand =
        brandFilter === "all" ||
        product.brand?._id === brandFilter;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, search, categoryFilter, brandFilter]);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.title}? This cannot be undone.`)) return;

    const response = await fetch(`/api/products?id=${encodeURIComponent(product._id)}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      window.location.reload();
      return;
    }

    const result = await response.json().catch(() => null);
    window.alert(result?.error || "Could not delete this product.");
  }

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Products */}
        <div className="min-w-0 border border-gray-200 bg-white">
          <div className="flex items-center justify-start p-4">
            <i className="bx bxs-shopping-bag-alt pr-2 text-[20px] text-shop-light-green" />

            <h2 className="text-sm font-semibold text-gray-400">
              Total Products
            </h2>
          </div>

          <div className="flex justify-between px-4 py-2">
            <p className="text-lg font-semibold text-gray-900">
              {totalProducts.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Total Stock */}
        <div className="min-w-0 border border-gray-200 bg-white">
          <div className="flex items-center justify-start p-4">
            <i className="bx bxs-bolt-circle pr-2 text-[20px] text-shop-light-green" />

            <h2 className="text-sm font-semibold text-gray-400">
              Total Stock
            </h2>
          </div>

          <div className="flex justify-between px-4 py-2">
            <p className="text-lg font-semibold text-gray-900">
              {totalStock.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Total Sold */}
        <div className="min-w-0 border border-gray-200 bg-white">
          <div className="flex items-center justify-start p-4">
            <i className="bx bx-dollar mr-2 rounded-sm bg-shop-light-green p-1 text-sm text-white" />

            <h2 className="text-sm font-semibold text-gray-400">
              Total Sold
            </h2>
          </div>

          <div className="flex justify-between px-4 py-2">
            <p className="text-lg font-semibold text-gray-900">
              12,760
            </p>
          </div>
        </div>

        {/* Total Categories */}
        <div className="min-w-0 border border-gray-200 bg-white">
          <div className="flex items-center justify-start p-4">
            <i className="bx bx-category-alt mr-2 rounded-sm bg-shop-light-green p-1 text-sm text-white" />

            <h2 className="text-sm font-semibold text-gray-400">
              Total Categories
            </h2>
          </div>

          <div className="flex justify-between px-4 py-2">
            <p className="text-lg font-semibold text-gray-900">
              {categories.length.toLocaleString()}
            </p>
          </div>
        </div>
      </div>


      {/* =====================================================
          PRODUCT CREATION
      ====================================================== */}

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">

        {/* Image / Brand Upload */}
        <div className="min-w-0 border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Media
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload product images and manage brand information.
            </p>
          </div>

          <ImageUpLoader initialBrands={brands} />
        </div>


        {/* Product Form */}
        <div className="min-w-0 border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Add Product
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a new product to your store.
            </p>
          </div>

          <ProductForm
            categories={categories}
            brands={brands}
            onProductSaved={() => router.refresh()}
          />
        </div>
      </div>


      {/* =====================================================
          PRODUCT MANAGEMENT
      ====================================================== */}

      <div className="min-w-0 border border-gray-200 bg-white">

        {/* Header */}
        <div className="border-b border-gray-200 p-4">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your store products.
              </p>
            </div>

            <button
              type="button"
              className="flex w-fit items-center gap-2 rounded-md bg-shop-light-green px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              <i className="bx bx-plus" />
              Add Product
            </button>
          </div>


          {/* Search / Filters */}
          <div className="mt-5 grid gap-3 md:grid-cols-3">

            {/* Search */}
            <div className="relative">
              <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-shop-light-green"
              />
            </div>


            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 outline-none focus:border-shop-light-green"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.title}
                </option>
              ))}
            </select>


            {/* Brand */}
            <select
              value={brandFilter}
              onChange={(e) =>
                setBrandFilter(e.target.value)
              }
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 outline-none focus:border-shop-light-green"
            >
              <option value="all">
                All Brands
              </option>

              {brands.map((brand) => (
                <option
                  key={brand._id}
                  value={brand._id}
                >
                  {brand.title}
                </option>
              ))}
            </select>

          </div>
        </div>


        {/* =====================================================
            PRODUCT TABLE
        ====================================================== */}

        <div className="w-full overflow-x-auto">

          <table className="w-full min-w-200 text-left">

            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>

                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                  Product
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                  Category
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                  Brand
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                  Price
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                  Stock
                </th>

                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody className="divide-y divide-gray-100">

              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (

                  <tr
                    key={product._id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* Product */}
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        {product.image ? (
                          <img
                            src={resolveProductImage(product.image)}
                            alt={product.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                            <i className="bx bx-image text-gray-400" />
                          </div>
                        )}

                        <span className="max-w-55 truncate text-sm font-medium text-gray-900">
                          {product.title}
                        </span>

                      </div>

                    </td>


                    {/* Category */}
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {product.category?.title || "—"}
                    </td>


                    {/* Brand */}
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {product.brand?.title || "—"}
                    </td>


                    {/* Price */}
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      ₦{product.price.toLocaleString()}
                    </td>


                    {/* Stock */}
                    <td className="px-4 py-4">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.stock > 10
                            ? "bg-green-50 text-green-600"
                            : product.stock > 0
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>

                    </td>


                    {/* Actions */}
                    <td className="px-4 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => router.push(`/product/${product.slug}`)}
                          className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          title="View product"
                        >
                          <i className="bx bx-show" />
                        </button>

                        <button
                          type="button"
                          onClick={() => router.push(`/edit?product=${encodeURIComponent(product._id)}`)}
                          className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          title="Edit product"
                        >
                          <i className="bx bx-edit-alt" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product)}
                          className="rounded-md p-2 text-red-500 transition hover:bg-red-50"
                          title="Delete product"
                        >
                          <i className="bx bx-trash" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              ) : (

                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <i className="bx bx-package text-4xl text-gray-300" />

                      <p className="mt-2 text-sm font-medium text-gray-600">
                        No products found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Try changing your search or filters.
                      </p>

                    </div>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {products.length}
            </span>{" "}
            products
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-400"
            >
              <i className="bx bx-chevron-left" />
            </button>

            <span className="rounded-md bg-shop-light-green px-3 py-2 text-sm text-white">
              1
            </span>

            <button
              type="button"
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <i className="bx bx-chevron-right" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UsersProductDashboard;
