import express from "express";
import slugify from "slugify";

import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";

import { productSeedData } from "../data/productSeedData.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let inserted = 0;
    let updated = 0;

    for (const item of productSeedData) {
      let category = await Category.findOne({
        title: item.category,
      });

      if (!category) {
        category = await Category.create({
          title: item.category,

          slug: slugify(item.category, {
            lower: true,
            strict: true,
          }),

          description: `${item.category} products`,
        });
      }

      const brandTitle = item.name.split(" ")[0];

      let brand = await Brand.findOne({
        title: brandTitle,
      });

      if (!brand) {
        brand = await Brand.create({
          title: brandTitle,

          slug: slugify(brandTitle, {
            lower: true,
            strict: true,
          }),
        });
      }

      const slug =
        item.slug ||
        slugify(item.name, {
          lower: true,

          strict: true,
        });

      const code =
        item.code ||
        slugify(item.name, {
          lower: true,

          strict: true,
        });

      const existing = await Product.findOne({
        slug,
      });

      if (existing) {
        await Product.updateOne(
          {
            _id: existing._id,
          },

          {
            $set: {
              name: item.name,
              description: item.description,
              images: item.images,
              price: item.price,
              code,
              category: category._id,
              brand: brand._id,
            },
          },
        );

        updated++;
      } else {
        await Product.create({
          name: item.name,

          slug,

          code,

          description: item.description,

          images: item.images,

          price: item.price,

          category: category._id,

          brand: brand._id,

          discount: 0,

          stock: 20,

          status: "new",

          variants: [],

          isFeatured: false,
        });

        inserted++;
      }
    }

    return res.json({
      success: true,

      inserted,

      updated,

      total: productSeedData.length,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json(err);
  }
});

export default router;
