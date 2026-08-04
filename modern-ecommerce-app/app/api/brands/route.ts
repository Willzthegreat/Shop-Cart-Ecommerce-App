import { NextResponse } from "next/server";
import slugify from "slugify";
import DatabaseConnection from "@/lib/mongodb/mongodb";
import Brand from "@/models/brandType";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const title = String(form.get("title") || "").trim();
    const file = form.get("logo");

    if (!title || !(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "A brand name and image are required." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Images must be 5 MB or smaller." }, { status: 400 });
    }

    await DatabaseConnection();
    const logo = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`;
    const slug = slugify(title, { lower: true, strict: true });
    const brand = await Brand.findOneAndUpdate(
      { slug },
      { $set: { title, slug, logo } },
      { new: true, upsert: true, runValidators: true },
    ).lean();

    return NextResponse.json({ ...brand, _id: brand?._id.toString() });
  } catch (error) {
    console.error("Brand upload failed:", error);
    return NextResponse.json({ error: "Could not save the brand." }, { status: 500 });
  }
}
