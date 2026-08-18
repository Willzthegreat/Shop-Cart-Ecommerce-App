import DatabaseConnection from "@/lib/mongodb/mongodb";
import mongoose from "mongoose";
import Category from "@/models/categoryType";
import Product from "@/models/product";
import Order from "@/models/orderType";
import Blog from "@/models/blogType";
import Brand from "@/models/brandType";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyUserSession } from "@/lib/authSession";
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

const getSellerBrands = async () => {
  try {
    const session = await verifyUserSession(
      (await cookies()).get(SESSION_COOKIE)?.value,
    );
    if (!session) return [];

    await DatabaseConnection();
    let brands = await Brand.find({
      $or: [
        { ownerId: session.userId },
        { ownerId: { $exists: false } },
        { ownerId: null },
      ],
    })
      .sort({ title: 1 })
      .lean();

    if (brands.length === 0) {
      brands = await Brand.find({}).sort({ title: 1 }).lean();
    }

    return brands.map((brand) => ({
      ...brand,
      _id: brand._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching seller brands:", error);
    return [];
  }
};

const getSellerCategories = async () => {
  try {
    const session = await verifyUserSession(
      (await cookies()).get(SESSION_COOKIE)?.value,
    );
    if (!session) return [];

    await DatabaseConnection();
    let categories = await Category.find({
      $or: [
        { ownerId: session.userId },
        { ownerId: { $exists: false } },
        { ownerId: null },
      ],
    })
      .sort({ title: 1 })
      .lean();

    if (categories.length === 0) {
      categories = await Category.find({}).sort({ title: 1 }).lean();
    }

    return categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching seller categories:", error);
    return [];
  }
};

const getSellerProducts = async () => {
  try {
    const session = await verifyUserSession(
      (await cookies()).get(SESSION_COOKIE)?.value,
    );
    if (!session) return [];

    await DatabaseConnection();
    const sellerObjectId = new mongoose.Types.ObjectId(session.userId);
    const sellerIds = [session.userId, sellerObjectId];
    const sellerBrands = await Brand.find({ ownerId: { $in: sellerIds } })
      .select("_id")
      .lean();
    const sellerBrandIds = sellerBrands.map((brand) => brand._id);
    const ownershipFilters: Record<string, unknown>[] = [
      { ownerId: { $in: sellerIds } },
      { sellerId: session.userId },
      { userId: session.userId },
      { createdBy: session.userId },
    ];

    if (sellerBrandIds.length > 0) {
      ownershipFilters.push({
        ownerId: { $exists: false },
        brand: { $in: sellerBrandIds },
      });
    }

    const products = await Product.find({ $or: ownershipFilters })
      .sort({ createdAt: -1 })
      .populate("category", "title slug")
      .populate("brand", "title slug logo")
      .lean();

    return products.map((product) => {
      const category = product.category as
        | { _id?: unknown; title?: string; slug?: string }
        | string
        | null
        | undefined;
      const brand = product.brand as
        | { _id?: unknown; title?: string; slug?: string; logo?: string }
        | string
        | null
        | undefined;

      return {
        ...product,
        _id: product._id.toString(),
        title: product.name,
        image: product.images?.[0] || "",
        category: category
          ? {
              ...(typeof category === "object" ? category : {}),
              _id: String(
                typeof category === "object" ? category._id : category,
              ),
            }
          : null,
        brand: brand
          ? {
              ...(typeof brand === "object" ? brand : {}),
              _id: String(typeof brand === "object" ? brand._id : brand),
            }
          : null,
      };
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
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

/**
 * Get revenue from completed customer orders for the seller dashboard.
 */
const getSellerTotalSales = async () => {
  try {
    await DatabaseConnection();

    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - 7);
    const previousWeekStart = new Date(now);
    previousWeekStart.setDate(now.getDate() - 14);
    const completedStatuses = [
      "paid",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];

    const [result] = await Order.aggregate([
      { $match: { status: { $in: completedStatuses } } },
      {
        $facet: {
          allTime: [{ $group: { _id: null, total: { $sum: "$totalPrice" } } }],
          currentWeek: [
            { $match: { orderDate: { $gte: currentWeekStart, $lte: now } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ],
          previousWeek: [
            {
              $match: {
                orderDate: {
                  $gte: previousWeekStart,
                  $lt: currentWeekStart,
                },
              },
            },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ],
          orders: [
            { $match: { status: { $ne: "cancelled" } } },
            { $count: "count" },
          ],
          visitors: [
            { $match: { status: { $ne: "cancelled" } } },
            { $group: { _id: "$email" } },
            { $count: "count" },
          ],
          currentWeekOrders: [
            {
              $match: {
                status: { $ne: "cancelled" },
                orderDate: { $gte: currentWeekStart, $lte: now },
              },
            },
            { $count: "count" },
          ],
          previousWeekOrders: [
            {
              $match: {
                status: { $ne: "cancelled" },
                orderDate: { $gte: previousWeekStart, $lt: currentWeekStart },
              },
            },
            { $count: "count" },
          ],
          currentWeekVisitors: [
            {
              $match: {
                status: { $ne: "cancelled" },
                orderDate: { $gte: currentWeekStart, $lte: now },
              },
            },
            { $group: { _id: "$email" } },
            { $count: "count" },
          ],
          previousWeekVisitors: [
            {
              $match: {
                status: { $ne: "cancelled" },
                orderDate: { $gte: previousWeekStart, $lt: currentWeekStart },
              },
            },
            { $group: { _id: "$email" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const totalSales = Number(result?.allTime?.[0]?.total) || 0;
    const currentWeekSales = Number(result?.currentWeek?.[0]?.total) || 0;
    const previousWeekSales = Number(result?.previousWeek?.[0]?.total) || 0;
    const totalOrders = Number(result?.orders?.[0]?.count) || 0;
    const visitors = Number(result?.visitors?.[0]?.count) || 0;
    const currentWeekOrders = Number(result?.currentWeekOrders?.[0]?.count) || 0;
    const previousWeekOrders = Number(result?.previousWeekOrders?.[0]?.count) || 0;
    const currentWeekVisitors = Number(result?.currentWeekVisitors?.[0]?.count) || 0;
    const previousWeekVisitors = Number(result?.previousWeekVisitors?.[0]?.count) || 0;
    const getPercentageChange = (current: number, previous: number) =>
      previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;
    const percentageChange =
      previousWeekSales === 0
        ? currentWeekSales > 0
          ? 100
          : 0
        : ((currentWeekSales - previousWeekSales) / previousWeekSales) * 100;

    return {
      totalSales,
      percentageChange,
      totalOrders,
      visitors,
      ordersPercentageChange: getPercentageChange(currentWeekOrders, previousWeekOrders),
      visitorsPercentageChange: getPercentageChange(currentWeekVisitors, previousWeekVisitors),
    };
  } catch (error) {
    console.error("Error fetching seller sales:", error);
    return {
      totalSales: 0,
      percentageChange: 0,
      totalOrders: 0,
      visitors: 0,
      ordersPercentageChange: 0,
      visitorsPercentageChange: 0,
    };
  }
};

export {
  getCategories,
  getAllBrands,
  getSellerBrands,
  getSellerCategories,
  getSellerProducts,
  getLatestBlogs,
  getBlogBySlug,
  getDealProducts,
  getProductBySlug,
  getBrand,
  getSellerTotalSales,
};

