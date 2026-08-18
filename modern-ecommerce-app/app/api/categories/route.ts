// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Category from "@/models/categoryType";

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const category = await Category.create({
//       title: body.title,

//       description: body.description,

//       range: body.range,

//       featured: body.featured,

//       image: body.image,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         data: category,
//       },
//       {
//         status: 201,
//       },
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Category creation failed",
//         error,
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import Category from "@/models/categoryType";

import slugify from "slugify";
import { normalizeCategoryName } from "@/lib/categoryName";
import { SESSION_COOKIE, verifyUserSession } from "@/lib/authSession";

export async function GET(request: NextRequest) {
  try {
    const session = await verifyUserSession(
      request.cookies.get(SESSION_COOKIE)?.value,
    );
    if (!session) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    await connectDB();
    let categories = await Category.find({
      $or: [
        { ownerId: session.userId },
        { ownerId: { $exists: false } },
        { ownerId: null },
      ],
    })
      .select("_id title slug image")
      .sort({ title: 1 })
      .lean();

    if (categories.length === 0) {
      categories = await Category.find({})
        .select("_id title slug image")
        .sort({ title: 1 })
        .lean();
    }

    return NextResponse.json(
      categories.map((category) => ({ ...category, _id: category._id.toString() })),
    );
  } catch (error) {
    console.error("Seller categories lookup failed:", error);
    return NextResponse.json({ error: "Could not load categories." }, { status: 500 });
  }
}

// CREATE CATEGORY

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const title = String(body.title || "").trim();
    const session = await verifyUserSession(
      req.headers.get("cookie")?.match(
        new RegExp(`${SESSION_COOKIE}=([^;]+)`),
      )?.[1],
    );

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 },
      );
    }

    const normalizedTitle = normalizeCategoryName(title);
    const existingCategories = await Category.find({}).select("_id title slug").lean();
    const existingCategory = existingCategories.find(
      (category) => normalizeCategoryName(category.title) === normalizedTitle,
    );

    if (existingCategory) {
      return NextResponse.json({ success: true, data: existingCategory, existing: true });
    }

    const category = await Category.create({
      ownerId: session?.userId,
      title,

      slug: slugify(title, {
        lower: true,

        strict: true,
      }),

      description: body.description,

      range: body.range,

      featured: body.featured,

      image: body.image,
    });

    return NextResponse.json(
      {
        success: true,

        data: category,
      },

      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message: "Category creation failed",

        error: error.message,
      },

      {
        status: 500,
      },
    );
  }
}
