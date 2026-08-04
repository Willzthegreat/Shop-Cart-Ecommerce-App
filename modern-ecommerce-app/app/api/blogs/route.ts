import { NextResponse } from "next/server";
import slugify from "slugify";
import DatabaseConnection from "@/lib/mongodb/mongodb";
import Blog from "@/models/blogType";
import Author from "@/models/authorType";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const title = String(form.get("title") || "").trim();
    const body = String(form.get("body") || "").trim();
    const authorName = String(form.get("author") || "").trim();
    const file = form.get("mainImage");

    if (!title || !body || !authorName) {
      return NextResponse.json(
        { error: "Title, body, and author are required." },
        { status: 400 },
      );
    }

    if (file && (!(file instanceof File) || !file.type.startsWith("image/"))) {
      return NextResponse.json(
        { error: "The blog image must be a valid image file." },
        { status: 400 },
      );
    }

    if (file instanceof File && file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Images must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    await DatabaseConnection();

    const author = await Author.findOneAndUpdate(
      { slug: slugify(authorName, { lower: true, strict: true }) },
      { $setOnInsert: { name: authorName } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    const baseSlug = slugify(title, { lower: true, strict: true }) || "blog";
    let slug = baseSlug;
    let suffix = 1;
    while (await Blog.exists({ slug })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const mainImage =
      file instanceof File
        ? `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`
        : "";

    const blog = await Blog.create({
      title,
      slug,
      body,
      author: author._id,
      mainImage,
      isLatest: true,
      publishedAt: new Date(),
    });

    return NextResponse.json(
      { ...blog.toObject(), _id: blog._id.toString(), author: author.name },
      { status: 201 },
    );
  } catch (error) {
    console.error("Blog creation failed:", error);
    return NextResponse.json({ error: "Could not save the blog." }, { status: 500 });
  }
}
