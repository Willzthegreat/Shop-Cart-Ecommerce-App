import dbConnect from "@/lib/mongodb/mongodb";
import Brand from "@/models/brandType";
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

const getAllBrands = async ({ quantity }: { quantity?: number } = {}) => {
  try {
    await dbConnect();

    const brands = await Brand.find({})
      .sort({ name: 1 })
      .limit(quantity || 0)
      .lean();

    return brands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export { getCategories, getAllBrands };