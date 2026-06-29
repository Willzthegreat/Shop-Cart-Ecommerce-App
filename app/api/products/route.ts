import connectDB  from "@/lib/mongodb/mongodb";
import Product from "@/models/product";
import { products } from "@/components/productArray";

export async function POST() {
  await connectDB();

  const savedProducts = await Product.insertMany(products);

  return Response.json({
    message: "Products uploaded",
    data: savedProducts,
  });
}
