import slugify from "slugify";

import connectDB from "@/lib/mongodb/mongodb";
import Product from "@/models/product";
import Category from "@/models/categoryType";
import Brand from "@/models/brandType";
import { products } from "@/seed/products";

function getBrandTitle(name: string) {
  return name.split(" ")[0] || "Unknown";
}

export async function seedProducts() {
  await connectDB();

  let inserted = 0;
  let updated = 0;

  for (const item of products) {
    let category = await Category.findOne({ title: item.category });

    if (!category) {
      category = await Category.create({
        title: item.category,
        slug: slugify(item.category, { lower: true, strict: true }),
        description: `${item.category} products`,
        featured: false,
        image: "",
      });
    }

    const brandTitle = getBrandTitle(item.name);
    let brand = await Brand.findOne({ title: brandTitle });

    if (!brand) {
      brand = await Brand.create({
        title: brandTitle,
        slug: slugify(brandTitle, { lower: true, strict: true }),
      });
    }

    const slug =
      item.slug ||
      slugify(item.name, {
        lower: true,
        strict: true,
      });

    const code =
      (item as { code?: string }).code ||
      slugify(item.name, {
        lower: true,
        strict: true,
      });

    const existing = await Product.findOne({ slug });

    if (existing) {
      await Product.updateOne(
        { _id: existing._id },
        {
          $set: {
            name: item.name,
            slug,
            code,
            description: item.description,
            images: item.image,
            price: item.price,
            category: category._id,
            brand: brand._id,
          },
        },
      );

      updated++;
      continue;
    }

    await Product.create({
      name: item.name,
      slug,
      code,
      description: item.description,
      images: item.image,
      price: item.price,
      discount: 0,
      category: category._id,
      brand: brand._id,
      stock: 20,
      status: "new",
      variants: [],
      isFeatured: false,
    });

    inserted++;
  }

  return {
    inserted,
    updated,
    total: products.length,
  };
}
