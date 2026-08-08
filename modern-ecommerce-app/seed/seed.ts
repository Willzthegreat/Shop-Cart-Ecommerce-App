import DatabaseConnection from "@/lib/mongodb/mongodb";
import slugify from "slugify";
import { normalizeCategoryName } from "@/lib/categoryName";

import Category from "@/models/categoryType";
import Brand from "@/models/brandType";
import Product from "@/models/product";

import { products } from "./products";

async function seedProducts() {
  await DatabaseConnection();

  for (const item of products) {
    const categories = await Category.find({}).select("title");
    let category = categories.find(
      (candidate) => normalizeCategoryName(candidate.title) === normalizeCategoryName(item.category),
    );

    if (!category) {
      category = await Category.create({
        title: item.category,
        description: `${item.category} products`,
        featured: false,
        image: "",
      });
    }

    const brandName = item.name.split(" ")[0];
    const brands = await Brand.find({}).select("title");
    let brand = brands.find(
      (candidate) => normalizeCategoryName(candidate.title) === normalizeCategoryName(brandName),
    );

    if (!brand) {
      brand = await Brand.create({
        title: brandName,
        slug: slugify(brandName, { lower: true, strict: true }),
        logo: "",
      });
    }

    const existingProduct = await Product.findOne({ slug: item.slug });

    if (existingProduct) {
      console.log(`${item.name} already exists`);
      continue;
    }

    await Product.create({
      name: item.name,
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

    console.log(`${item.name} imported`);
  }

  console.log("Products imported successfully.");
}

seedProducts();
