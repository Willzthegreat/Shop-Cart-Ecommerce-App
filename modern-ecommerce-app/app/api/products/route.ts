import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb/mongodb";
import Product from "@/models/product";
import Category from "@/models/categoryType";
import Brand from "@/models/brandType";
import slugify from "slugify";
import { normalizeCategoryName } from "@/lib/categoryName";

export async function POST(req: Request) {
  try {
    await connectDB();
    const form = await req.formData();
    const body = Object.fromEntries(form.entries());
    const name = String(body.name || "").trim();
    const categoryId = String(body.category || "");
    const brandId = String(body.brand || "");
    const price = Number(body.price);
    const discount = Number(body.discount || 0);
    const imageUrls = String(body.images || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const imageFiles = form
      .getAll("imageFiles")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!name || !categoryId || !brandId || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Name, price, category, and brand are required." }, { status: 400 });
    }

    if (!Number.isFinite(discount) || discount < 0) {
      return NextResponse.json({ error: "Discount price must be zero or a valid positive price." }, { status: 400 });
    }

    const [category, brand] = await Promise.all([
      Category.findById(categoryId).select("_id"),
      Brand.findById(brandId).select("_id"),
    ]);
    if (!category || !brand) {
      return NextResponse.json({ error: "Selected category or brand was not found." }, { status: 400 });
    }

    for (const imageFile of imageFiles) {
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json({ error: "The uploaded file must be an image." }, { status: 400 });
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Uploaded images must be 5 MB or smaller." }, { status: 400 });
      }
    }

    const uploadedImages = await Promise.all(
      imageFiles.map(async (imageFile) =>
        `data:${imageFile.type};base64,${Buffer.from(await imageFile.arrayBuffer()).toString("base64")}`
      )
    );

    const product = await Product.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      code: body.code ? String(body.code).trim() : undefined,
      description: String(body.description || ""),
      images: [...uploadedImages, ...imageUrls],
      price,
      discount,
      category: category._id,
      brand: brand._id,
      stock: Number(body.stock || 0),
      status: body.status || "new",
      variants: Array.isArray(body.variants) ? body.variants.map(String).filter(Boolean) : [],
      isFeatured: Boolean(body.isFeatured),
    });

    return NextResponse.json({
      success: true,
      data: { ...product.toObject(), _id: product._id.toString() },
    });
  } catch (error) {
    console.error("Product creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const tab = url.searchParams.get("tab") || "";
    const categorySlug = url.searchParams.get("category") || "";
    const brandSlug = url.searchParams.get("brand") || "";
    const minPriceParam = url.searchParams.get("minPrice");
    const maxPriceParam = url.searchParams.get("maxPrice");
    const search = url.searchParams.get("q")?.trim() || "";
    const requestedLimit = Number(url.searchParams.get("limit"));
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(Math.floor(requestedLimit), 100)
      : 0;
    const minPrice = minPriceParam === null ? NaN : Number(minPriceParam);
    const maxPrice = maxPriceParam === null ? NaN : Number(maxPriceParam);

    const tabMap: Record<string, string[]> = {
      Gadget: ["Mobiles", "Smartphones", "Gadget Accessories", "Gadgets", "Mobile Phones", "Phones", "Electronics"],
      Appliances: ["Appliances", "Kitchen Appliances", "Washing Machines", "Air Conditioners"],
      Refrigerators: ["Appliances"],
      Others: [],
    };

    const filter: Record<string, unknown> = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedSearch, "i");
      const [matchingCategories, matchingBrands] = await Promise.all([
        Category.find({ title: searchRegex }).select("_id").lean(),
        Brand.find({ title: searchRegex }).select("_id").lean(),
      ]);

      filter.$or = [
        { name: searchRegex },
        { code: searchRegex },
        { description: searchRegex },
        { status: searchRegex },
        { category: { $in: matchingCategories.map((item) => item._id) } },
        { brand: { $in: matchingBrands.map((item) => item._id) } },
      ];
    }

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug }).select("_id");
      if (!category) return NextResponse.json({ data: [] });

      const selectedCategory = await Category.findById(category._id).select("title");
      const matchingCategories = selectedCategory
        ? await Category.find({}).select("_id title").lean()
        : [];
      const matchingIds = matchingCategories
        .filter(
          (item) =>
            normalizeCategoryName(item.title) === normalizeCategoryName(selectedCategory?.title || ""),
        )
        .map((item) => item._id);

      filter.category = { $in: matchingIds };
    }

    if (brandSlug) {
      const brand = await Brand.findOne({ slug: brandSlug }).select("_id");
      if (!brand) return NextResponse.json({ data: [] });
      const selectedBrand = await Brand.findById(brand._id).select("title");
      const matchingBrands = selectedBrand
        ? await Brand.find({}).select("_id title").lean()
        : [];
      const matchingIds = matchingBrands
        .filter(
          (item) =>
            normalizeCategoryName(item.title) === normalizeCategoryName(selectedBrand?.title || ""),
        )
        .map((item) => item._id);

      filter.brand = { $in: matchingIds };
    }

    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      filter.price = {};
      if (Number.isFinite(minPrice)) (filter.price as Record<string, number>).$gte = minPrice;
      if (Number.isFinite(maxPrice)) (filter.price as Record<string, number>).$lte = maxPrice;
    }

    if (tab) {
      const categoryTitles = tabMap[tab] || [];

      if (categoryTitles.length > 0) {
        const allCategories = await Category.find({}).select("_id title").lean();
        const supportedTitles = categoryTitles.map(normalizeCategoryName);
        const categoriesFound = allCategories.filter((category) =>
          supportedTitles.includes(normalizeCategoryName(category.title)),
        );
        const ids = categoriesFound.map((category) => category._id);

        if (ids.length > 0) {
          filter.category = { $in: ids };
        }
      } else {
        const category = await Category.findOne({
          title: { $regex: new RegExp(`^${tab}$`, "i") },
        });

        if (category) {
          filter.category = category._id;
        }
      }
    }

    const productQuery = Product.find(filter)
      .sort({ createdAt: -1 })
      .populate("category")
      .populate("brand");

    if (limit > 0) productQuery.limit(limit);

    const products = await productQuery.lean();

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      { success: false, message: "The product database is temporarily unavailable." },
      { status: 503 },
    );
  }
}
