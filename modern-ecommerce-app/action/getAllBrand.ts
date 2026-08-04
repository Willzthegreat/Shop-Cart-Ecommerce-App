import  DatabaseConnection  from "@/lib/mongodb/mongodb";
import Category from "@/models/categoryType";
import Product from "@/models/product";
import { getAllBrands } from "@/queries/query";

const getCategories = async ({ quantity }: { quantity?: number } = {}) => {
  try {
    await DatabaseConnection();   //Expected 1 arguments, but got 0.

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

export { getCategories, getAllBrands };