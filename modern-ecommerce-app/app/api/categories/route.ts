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

import { connectDB } from "@/lib/db";

import Category from "@/models/categoryType";

import slugify from "slugify";
import { normalizeCategoryName } from "@/lib/categoryName";

// CREATE CATEGORY

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const title = String(body.title || "").trim();

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
