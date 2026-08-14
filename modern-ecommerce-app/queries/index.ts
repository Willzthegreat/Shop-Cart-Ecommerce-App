import DatabaseConnection from "@/lib/mongodb/mongodb";
import Category from "@/models/categoryType";
import Product from "@/models/product";
import Blog from "@/models/blogType";
import Brand from "@/models/brandType";
// Blog.author uses the Author model. Importing it here registers the model
// before Mongoose tries to populate the author field below.
import "@/models/authorType";
import { normalizeCategoryName } from "@/lib/categoryName";

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

    const uniqueCategories = categories.filter(
      (category, index, all) =>
        index === all.findIndex(
          (candidate) => normalizeCategoryName(candidate.title) === normalizeCategoryName(category.title),
        ),
    );

    const productCounts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countByCategory = new Map(
      productCounts.map((item) => [String(item._id), item.count as number]),
    );

    const categoriesWithCount = uniqueCategories.map((category) => {
      const matchingCategoryIds = categories
        .filter(
          (candidate) =>
            normalizeCategoryName(candidate.title) === normalizeCategoryName(category.title),
        )
        .map((candidate) => String(candidate._id));

      const productCount = matchingCategoryIds.reduce(
        (total, categoryId) => total + (countByCategory.get(categoryId) || 0),
        0,
      );

      return {
        ...category,
        _id: category._id.toString(),
        productCount,
      };
    });

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

    const uniqueBrands = brands.filter(
      (brand, index, all) =>
        index === all.findIndex(
          (candidate) => normalizeCategoryName(candidate.title) === normalizeCategoryName(brand.title),
        ),
    );

    return uniqueBrands.map((brand) => ({
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

      blogCategories: [],

      author: blog.author
        ? typeof blog.author === "object"
          ? {
              ...blog.author,
              _id: blog.author._id?.toString(),
            }
          : blog.author.toString()
        : null,
    }));
  } catch (error) {
    console.error("Error fetching latest blogs:", error);
    return [];
  }
};

/**
 * Get one blog by slug
 */
const getBlogBySlug = async (slug: string) => {
  try {
    await DatabaseConnection();

    const blog = (await Blog.findOne({ slug })
      .populate("author", "name image bio")
      .lean()) as any;

    if (!blog) {
      return null;
    }

    return {
      ...blog,
      _id: blog._id.toString(),
      author: blog.author
        ? typeof blog.author === "object"
          ? {
              ...blog.author,
              _id: blog.author._id?.toString(),
            }
          : blog.author.toString()
        : null,
    };
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
};

/**
 * Get deal products
 *
 * Gets products marked as hot/sale or products whose original price is above
 * the current price.
 */
const getDealProducts = async (
  { quantity }: { quantity?: number } = {}
) => {
  try {
    await DatabaseConnection();

    const query = Product.find({
      $or: [
        { $expr: { $gt: ["$discount", "$price"] } },
        { status: { $in: ["hot", "sale"] } },
      ],
    })
      .sort({
        createdAt: -1,
        discount: -1,
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

/**
 * Get product by slug
 */
const getProductBySlug = async (slug: string) => {
  try {
    await DatabaseConnection();

    const product = await Product.findOne({
      slug,
    })
      .populate("category", "title slug")
      .populate("brand", "title slug image")
      .lean();

    if (!product) {
      return null;
    }

    return {
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
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

/**
 * Get brand by slug
 */
const getBrand = async (slug: string) => {
  try {
    await DatabaseConnection();

    const brand = await Brand.findOne({
      slug,
    }).lean();

    if (!brand) {
      return null;
    }

    return {
      ...brand,
      _id: brand._id.toString(),
    };
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
};

export {
  getCategories,
  getAllBrands,
  getLatestBlogs,
  getBlogBySlug,
  getDealProducts,
  getProductBySlug,
  getBrand,
};

