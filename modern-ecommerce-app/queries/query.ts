import dbConnect from "@/lib/mongodb/mongodb";
import Brand from "@/models/brandType";
import Blog from "@/models/blogType";
import Product from "@/models/product";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyUserSession } from "@/lib/authSession";

/**
 * Get all brands
 */
const getAllBrands = async (
  { quantity }: { quantity?: number } = {}
) => {
  try {
    await dbConnect();

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

const getSellerBrands = async () => {
  try {
    const session = await verifyUserSession(
      (await cookies()).get(SESSION_COOKIE)?.value,
    );
    if (!session) return [];

    await dbConnect();
    const brands = await Brand.find({ ownerId: session.userId })
      .sort({ title: 1 })
      .lean();

    return brands.map((brand) => ({
      ...brand,
      _id: brand._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching seller brands:", error);
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

    const blogs = await query.lean();

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

/**
 * Get product by slug
 */
const getProductBySlug = async (slug: string) => {
  try {
    await dbConnect();

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
    await dbConnect();

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
  getAllBrands,
  getSellerBrands,
  getLatestBlogs,
  getDealProducts,
  getProductBySlug,
  getBrand,
};

