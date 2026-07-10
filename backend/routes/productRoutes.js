import express from "express";
import mongoose from "mongoose";
import slugify from "slugify";

const router = express.Router();

const productSeedData = [
  {
    name: "Sample Smartphone",
    description: "A sample product returned from the backend API.",
    price: 699,
    category: "Mobile",
    images: ["/banner1.png"],
},
  {
    name: "Smart Refrigerator",
    description: "A backend-served appliance product.",
    price: 1299,
    category: "Appliances",
    images: ["/products/Smart Refrigerator_1.jpg"],
  },
   {
    name: "Scanfrost Chest Freezer",
    description: "Premium kitchen appliances product.",
    price: 1009,
    slug: "scanfrost-chest-freezer",
    category: "Refrigerators",
    images: [ "/products/scanfrost-chest-freezer_1.jpg" ],
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    description: "Flagship smartphone with AI features and professional camera technology.",
    price: 1299,
    slug: "samsung-galaxy-s25-ultra",
    category: "Smartphones",
    images: [ "/products/s25-ultra1.jpg" ],
  },
   {
      name: "Samsung WindFree Air Conditioner",
      description:
        "Smart cooling system with comfortable airflow and energy saving features.",
      price: 1200,
      slug: "samsung-windfree-air-conditioner",
      category: "Air Conditioners",
      images: [
        "/products/samsung-windfree-ac1.jpg"
      ],
    },
     {
    name: "Sony Bravia 8",
    description: "Premium television product.",
    price: 298,
    slug: "sony-bravia-8",
    category: "Television",
    images: [ "/products/sony-bravia-8_1.jpg" ],
  },
   {
    name: "Samsung EcoBubble Washing Machine",
    description:
      "Automatic washing machine with bubble technology for deep cleaning.",
    price: 999,
    slug: "samsung-ecobubble-washing-machine",
    category: "Washing Machines",
    images: [ "/products/samsung-washing-machine1.jpg" ],
  },
  {
    name: "LG Dual Inverter Air Conditioner",
    description:
      "Energy-efficient AC with quiet cooling and smart temperature control.",
    price: 850,
    slug: "lg-dual-inverter-air-conditioner",
    category: "Air Conditioners",
    images: [ "/products/lg-inverter-ac1.jpg" ],
  },
];

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    image: { type: String, default: "" },
  }, { timestamps: true })
);

const Brand = mongoose.model(
  "Brand",
  new mongoose.Schema({
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  }, { timestamps: true })
);

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    stock: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["new", "hot", "sale"], default: "new" },
    variants: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
  }, { timestamps: true })
);

router.get("/", async (req, res) => {
  try {
    const tab = String(req.query.tab || "")
      .trim()
      .toLowerCase();

    for (const item of productSeedData) {
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

      const brandTitle = item.name.split(" ")[0] || "Unknown";
      let brand = await Brand.findOne({ title: brandTitle });
      if (!brand) {
        brand = await Brand.create({
          title: brandTitle,
          slug: slugify(brandTitle, { lower: true, strict: true }),
        });
      }

      const slug = slugify(item.name, { lower: true, strict: true });
      const existing = await Product.findOne({ slug });

      if (!existing) {
        await Product.create({
          name: item.name,
          slug,
          description: item.description,
          images: item.images,
          price: item.price,
          discount: 0,
          category: category._id,
          brand: brand._id,
          stock: 20,
          status: "new",
          variants: [],
          isFeatured: false,
        });
      }
    }

    const filter = tab
      ? { category: { $in: await Category.find({ title: { $regex: new RegExp(tab, "i") } }).select("_id").then((docs) => docs.map((doc) => doc._id)) } }
      : {};

    const products = await Product.find(filter).populate("category").populate("brand").lean();

    return res.json({ data: products });
  } catch (error) {
    console.error("Error loading products:", error);
    return res.status(500).json({ message: "Error loading products" });
  }
});

export default router;
