// import ProductCard from "./ProductCard";

// interface Props {
//   products: any[];
// }

// export default function ProductGrid({ products }: Props) {
//   return (
//     <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 ">
//       {products.map((product) => (
//         <ProductCard
//           key={product.slug}
//           name={product.name}
//           description={product.description}
//           price={product.price}
//           category={product.category}
//           image={product.image}
//         />
//       ))}
//     </div>
//   );
// }








// "use client";


// import  { useEffect, useState } from "react";
// import HomeTabBar from "./homeTabBar";
// import { productType } from "@/constants/data";
// import { client } from "@/lib/clients";




// const ProductGrid = () => {
//   const [ products, setProducts] = useState([]);
//   const [ loading, setLoading] = useState(false);
//   const [ selectedTab, setSelectedTab] = useState(productType[0]?.title || "");

// const query = `*[_type == "product" && category == $category]{
//   name,
//   description,
//   price,
//   category,
//   image,
//   slug
// }`; 


// const params = {variant: selectedTab.toLowerCase()};

// useEffect(() => {
//   const fetchData= async () => {
//     setLoading(true);
//     try {
//       // const data = await fetch(`/api/products?query=${encodeURIComponent(query)}&params=${encodeURIComponent(JSON.stringify(params))}`);
//       const response = await client.fetch(query, params);
//       setProducts(response); 
//     } catch (error) {
//       console.error("Product fetching Error:",error);
//     } finally {
//       setLoading(false);
//     }
//   }
// }, [selectedTab])

//   return (
//     <>
//     <div>
//       <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
//     </div>
//     </>
//   );
// };

// export default ProductGrid









"use client";

import { useEffect, useState } from "react";
import HomeTabBar from "./homeTabBar";
import Image from "next/image";
import { productType } from "@/constants/data";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  category?: any;
  images?: string[];
}

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState(
    productType[0]?.title || ""
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/products?tab=${encodeURIComponent(selectedTab)}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const json = await res.json();
        setProducts(json.data || []);
        console.log(res)
      } catch (error) {
        console.error("Product fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedTab]);

  return (
    <>
      <HomeTabBar
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
      />

      {loading ? (
        <p className="mt-8 text-center">Loading...</p>
      ) : (
        <div className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-5">
          {products.map((product) => (
            <div key={product._id} className="border rounded-xl p-2 bg-white">
              <div className="relative h-54 w-full overflow-hidden rounded-lg">
                <Image
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  // className="rounded-lg object-cover"
                  className="h-64 w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <p className="text-sm text-gray-400 mt-3">{product.category?.title || product.category}</p>
              <h2 className="font-semibold truncate">{product.name}</h2>
              <p className="font-bold mt-2">${product.price ?? "-"}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductGrid;