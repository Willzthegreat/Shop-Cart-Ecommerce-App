import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb/mongodb";
import Product from "@/models/product";
import Category from "@/models/categoryType";
import "@/models/brandType";

export async function POST() {
  try {
    const result = await import("@/lib/seedProducts").then(({ seedProducts }) => seedProducts());

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Seeding failed:", error);

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
    const tab = url.searchParams.get("tab") || url.searchParams.get("category") || "";

    const tabMap: Record<string, string[]> = {
      Gadget: ["Mobiles", "Smartphones", "Gadget Accessories"],
      Appliances: ["Appliances", "Kitchen Appliances", "Washing Machines", "Air Conditioners"],
      Refrigerators: ["Appliances"],
      Others: [],
    };

    const filter: Record<string, unknown> = {};

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
