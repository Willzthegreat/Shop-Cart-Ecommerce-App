// import { sanityFetch } from "../lib/live";


// const getCategories = async ({quantity?: number}) => {
//     try{
//         const query = quantity
//         ? `*[_type == 'category'] | order(name asc) [0...$quantity] {
//           ...,
//           "productCount" : count(*[_type == "product" && references(^._id)])
//         }` 
//         : `*[_type == 'category'] | order(name asc) {
//           ...,
//           "productCount" : count(*[_type == "product" && references(^._id)])
//         }`;

//         const {data} await sanityFetch({ 
//           query, 
//           params: quantity ? { quantity } : {},

//       });
//       return data;
        
//     } catch (error) {
//         console.log("Error fetching categories", error);
//         return [];
//     }
// }

// export { getCategories };





import dbConnect from "@/lib/mongodb/mongodb";
import Category from "@/models/categoryType";
import Product from "@/models/product";

const getCategories = async ({ quantity }: { quantity?: number } = {}) => {
  try {
    await dbConnect();

    const categories = await Category.find({})
      .sort({ title: 1 })
      .limit(quantity || 0)
      .lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
        });

        return {
          ...category,
          productCount,
        };
      })
    );

    return categoriesWithCount;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export { getCategories };