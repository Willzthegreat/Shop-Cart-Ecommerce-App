import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import DatabaseConnection from "@/lib/mongodb/mongodb";
import Brand from "@/models/brandType";
import { normalizeCategoryName } from "@/lib/categoryName";
import { SESSION_COOKIE, verifyUserSession } from "@/lib/authSession";

export const runtime = "nodejs";

function getSessionToken(request: NextRequest) {
  return request.cookies.get(SESSION_COOKIE)?.value;
}

export async function GET(request: NextRequest) {
  try {
    const session = await verifyUserSession(getSessionToken(request));
    if (!session) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    await DatabaseConnection();
    const brands = await Brand.find({ ownerId: session.userId })
      .select("_id ownerId title slug logo")
      .sort({ title: 1 })
      .lean();

    return NextResponse.json(
      brands.map((brand) => ({ ...brand, _id: brand._id.toString() })),
    );
  } catch (error) {
    console.error("Seller brands lookup failed:", error);
    return NextResponse.json({ error: "Could not load brands." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserSession(getSessionToken(request));

    if (!session) {
      return NextResponse.json({ error: "You must be logged in to upload a brand." }, { status: 401 });
    }

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
    const existingBrands = await Brand.find({ ownerId: session.userId })
      .select("_id ownerId title slug logo")
      .lean();
    const existingBrand = existingBrands.find(
      (brand) => normalizeCategoryName(brand.title) === normalizeCategoryName(title),
    );

    if (existingBrand) {
      return NextResponse.json({ ...existingBrand, _id: existingBrand._id.toString(), existing: true });
    }

    const logo = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`;
    const slug = slugify(title, { lower: true, strict: true });
    const brand = await Brand.findOneAndUpdate(
      { slug },
      { $set: { ownerId: session.userId, title, slug, logo } },
      { new: true, upsert: true, runValidators: true },
    ).lean();

    return NextResponse.json({ ...brand, _id: brand?._id.toString() });
  } catch (error) {
    console.error("Brand upload failed:", error);
    return NextResponse.json({ error: "Could not save the brand." }, { status: 500 });
  }
}
