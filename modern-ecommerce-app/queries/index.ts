import DatabaseConnection from "@/lib/mongodb/mongodb";
import Category from "@/models/categoryType";
import Product from "@/models/product";
import Blog from "@/models/blogType";
import Brand from "@/models/brandType";

/**
 * Get all categories
 */
const getCategories = async (
  { quantity }: { quantity?: number } = {}
) => {
  try {
    await DatabaseConnection();

    const query = Category.find({}).sort({
      title: 1,
    });

    if (quantity && quantity > 0) {
      query.limit(quantity);
    }

    const categories = await query.lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
        });

        return {
          ...category,
          _id: category._id.toString(),
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

/**
 * Get all brands
 */
const getAllBrands = async (
  { quantity }: { quantity?: number } = {}
) => {
  try {
    await DatabaseConnection();

    const query = Brand.find({}).sort({
      title: 1,
    });

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
    await DatabaseConnection();

    // Latest Blog is a storefront listing, so include existing published
    // documents as well as newer documents marked isLatest.
    const query = Blog.find({}).sort({
      publishedAt: -1,
      createdAt: -1,
    });

    if (quantity && quantity > 0) {
      query.limit(quantity);
    }

    const blogs = (await query
      .populate("author", "name")
      .lean()) as any[];

    return blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
      // BlogCategory is not currently registered or managed by the dashboard.
      // Keep the response safe until blog-category management is added.
      blogCategories: [],
      author: blog.author
        ? typeof blog.author === "object"
          ? { ...blog.author, _id: blog.author._id.toString() }
          : blog.author.toString()
        : null,
    }));
  } catch (error) {
    console.error("Error fetching latest blogs:", error);
    return [];
  }
};

/**
 * Get deal products
 *
 * Gets active products with a discount greater than 0.
 */
const getDealProducts = async (
  { quantity }: { quantity?: number } = {}
) => {
  try {
    await DatabaseConnection();

    const query = Product.find({
      discount: {
        $gt: 0,
      },
    })
      .sort({
        discount: -1,
        createdAt: -1,
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
  getCategories,
  getAllBrands,
  getLatestBlogs,
  getDealProducts,
};
