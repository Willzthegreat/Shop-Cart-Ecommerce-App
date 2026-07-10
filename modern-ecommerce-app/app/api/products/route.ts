import connectDB from "@/lib/mongodb/mongodb";
import Product from "@/models/product";
import Category from "@/models/categoryType";
import Brand from "@/models/brandType";
// Product seeding is no longer driven by this file; the frontend now fetches from the Express backend.
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

export async function GET(req: Request) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const tab = url.searchParams.get("tab") || url.searchParams.get("category") || "";

    // mapping from UI tabs to actual category titles in seeded data
    const tabMap: Record<string, string[]> = {
      Gadget: ["Mobiles", "Smartphones", "Gadget Accessories"],
      Appliances: ["Appliances", "Kitchen Appliances", "Washing Machines", "Air Conditioners"],
      Refrigerators: ["Appliances"],
      Others: [],
    };

    let filter: any = {};

    if (tab) {
      // try exact category match first (case-insensitive)
      const categoryTitles = tabMap[tab] || [];
      if (categoryTitles.length > 0) {
        const categoriesFound = await Category.find({ title: { $in: categoryTitles } }).select("_id");
        const ids = categoriesFound.map((c: any) => c._id);
        if (ids.length > 0) filter.category = { $in: ids };
      } else {
        // fallback: look for category with matching title (case-insensitive)
        const cat = await Category.findOne({ title: { $regex: new RegExp(`^${tab}$`, "i") } });
        if (cat) filter.category = cat._id;
      }
    }

    const productsData = await Product.find(filter)
      .populate("category")
      .populate("brand")
      .lean();

    return Response.json({ data: productsData });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ message: "Error fetching products" }), { status: 500 });
  }
}
