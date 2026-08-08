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

    const categoriesWithCount = await Promise.all(
      uniqueCategories.map(async (category) => {
        const matchingCategoryIds = categories
          .filter(
            (candidate) =>
              normalizeCategoryName(candidate.title) === normalizeCategoryName(category.title),
          )
          .map((candidate) => candidate._id);

        const productCount = await Product.countDocuments({
          category: { $in: matchingCategoryIds },
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
 * Get deal products
 *
 * Gets products with a discount greater than 0.
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
  getDealProducts,
  getProductBySlug,
  getBrand,
};

