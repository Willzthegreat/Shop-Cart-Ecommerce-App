import connectDB from "@/lib/mongodb/mongodb";
import Product from "@/models/product";
import Category from "@/models/categoryType";
import Brand from "@/models/brandType";
import { products } from "@/components/productArray";
import slugify from "slugify";

function getBrandTitle(name: string) {
  return name.split(" ")[0] || "Unknown";
}

export async function POST() {
  await connectDB();

  const savedProducts = [] as Array<any>;

  for (const item of products) {
    let category = await Category.findOne({ title: item.category });

    if (!category) {
      category = await Category.create({
        title: item.category,
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

    const productSlug =
      item.slug ||
      slugify(item.name, {
        lower: true,
        strict: true,
      });

    const existingProduct = await Product.findOne({ slug: productSlug });

    if (existingProduct) {
      await Product.updateOne(
        { _id: existingProduct._id },
        {
          $set: {
            name: item.name,
            description: item.description || "",
            images: item.image || [],
            price: item.price,
            discount: 0,
            category: category._id,
            brand: brand._id,
            stock: existingProduct.stock || 20,
            status: existingProduct.status || "new",
            variants: existingProduct.variants || [],
            isFeatured: existingProduct.isFeatured ?? false,
          },
        },
      );

      const updatedProduct = await Product.findById(existingProduct._id);
      savedProducts.push(updatedProduct);
      continue;
    }

    const createdProduct = await Product.create({
      name: item.name,
      description: item.description || "",
      images: item.image || [],
      price: item.price,
      discount: 0,
      category: category._id,
      brand: brand._id,
      stock: 20,
      status: "new",
      variants: [],
      isFeatured: false,
      slug: productSlug,
    });

    savedProducts.push(createdProduct);
  }

  return Response.json({
    message: "Products uploaded",
    data: savedProducts,
  });
}
