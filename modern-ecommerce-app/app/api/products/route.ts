import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb/mongodb";
import Product from "@/models/product";
import Category from "@/models/categoryType";
import Brand from "@/models/brandType";
import slugify from "slugify";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const name = String(body.name || "").trim();
    const categoryId = String(body.category || "");
    const brandId = String(body.brand || "");

    if (!name || !categoryId || !brandId || body.price === undefined) {
      return NextResponse.json({ error: "Name, price, category, and brand are required." }, { status: 400 });
    }

    const [category, brand] = await Promise.all([
      Category.findById(categoryId).select("_id"),
      Brand.findById(brandId).select("_id"),
    ]);
    if (!category || !brand) {
      return NextResponse.json({ error: "Selected category or brand was not found." }, { status: 400 });
    }

    const product = await Product.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      code: body.code ? String(body.code).trim() : undefined,
      description: String(body.description || ""),
      images: Array.isArray(body.images) ? body.images.map(String).filter(Boolean) : [],
      price: Number(body.price),
      discount: Number(body.discount || 0),
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
  await connectDB();

  try {
    const url = new URL(req.url);
    const tab = url.searchParams.get("tab") || "";
    const categorySlug = url.searchParams.get("category") || "";

    const tabMap: Record<string, string[]> = {
      Gadget: ["Mobiles", "Smartphones", "Gadget Accessories"],
      Appliances: ["Appliances", "Kitchen Appliances", "Washing Machines", "Air Conditioners"],
      Refrigerators: ["Appliances"],
      Others: [],
    };

    const filter: Record<string, unknown> = {};

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug }).select("_id");
      if (!category) return NextResponse.json({ data: [] });
      filter.category = category._id;
    }

    if (tab) {
      const categoryTitles = tabMap[tab] || [];

      if (categoryTitles.length > 0) {
        const categoriesFound = await Category.find({ title: { $in: categoryTitles } }).select("_id");
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

    const products = await Product.find(filter).populate("category").populate("brand").lean();

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      { success: false, message: "Error fetching products" },
      { status: 500 },
    );
  }
}
