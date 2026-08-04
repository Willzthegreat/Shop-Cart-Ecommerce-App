import dbConnect from "@/lib/mongodb/mongodb";
import Brand from "@/models/brandType";
import Blog from "@/models/blogType";
import Product from "@/models/product";

/**
 * Get all brands
 */
const getAllBrands = async (
  { quantity }: { quantity?: number } = {}
) => {
  try {
    await dbConnect();

    const query = Brand.find({}).sort({ title: 1 });

    if (quantity && quantity > 0) {
      query.limit(quantity);
    }

    const brands = await query.lean();

    return brands.map((brand) => ({
      ...brand,
      _id: brand._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

/**
 * Get latest blogs
 */
const getLatestBlogs = async (
  { quantity }: { quantity?: number } = {}
) => {
  try {
    await dbConnect();

    const query = Blog.find({}).sort({
      publishedAt: -1,
      createdAt: -1,
    });

    if (quantity && quantity > 0) {
      query.limit(quantity);
    }

    const blogs = await query
      .lean();

    return blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching latest blogs:", error);
    return [];
  }
};

/**
 * Get deal / hot products
 */
const getDealProducts = async (
  { quantity }: { quantity?: number } = {}
) => {
  try {
    await dbConnect();

    const query = Product.find({
      status: "hot",
    })
      .sort({
        name: 1,
      })
      .populate("category", "title slug")
      .populate("brand", "title slug image");

    if (quantity && quantity > 0) {
      query.limit(quantity);
    }

    const products = await query.lean();

    return products.map((product) => ({
      ...product,

      _id: product._id.toString(),

      category: product.category
        ? {
            ...product.category,
            _id: product.category._id.toString(),
          }
        : null,

      brand: product.brand
        ? {
            ...product.brand,
            _id: product.brand._id.toString(),
          }
        : null,
    }));
  } catch (error) {
    console.error("Error fetching deal products:", error);
    return [];
  }
};

export {
  getAllBrands,
  getLatestBlogs,
  getDealProducts,
};
