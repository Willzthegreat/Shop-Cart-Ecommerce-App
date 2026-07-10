const mongoose = require('mongoose');
const slugify = require('slugify');
const connectDB = require('./lib/mongodb/mongodb').default;
const Product = require('./models/product').default;
const Category = require('./models/categoryType').default;
const Brand = require('./models/brandType').default;
const { products } = require('./components/productArray');

(async () => {
  await connectDB();
  for (const item of products) {
    const slug = item.slug || slugify(item.name, { lower: true, strict: true });
    let category = await Category.findOne({ title: item.category });
    if (!category) {
      category = await Category.create({
        title: item.category,
        description: `${item.category} products`,
        featured: false,
        image: ''
      });
    }

    const brandTitle = item.name.split(' ')[0] || 'Unknown';
    let brand = await Brand.findOne({ title: brandTitle });
    if (!brand) {
      brand = await Brand.create({
        title: brandTitle,
        slug: slugify(brandTitle, { lower: true, strict: true })
      });
    }

    const existing = await Product.findOne({ slug });
    if (existing) {
      await Product.updateOne(
        { _id: existing._id },
        { $set: { category: category._id, brand: brand._id, images: item.image || [] } }
      );
      console.log('updated', slug, 'category=', category.title);
    } else {
      await Product.create({
        name: item.name,
        description: item.description || '',
        images: item.image || [],
        price: item.price,
        discount: 0,
        category: category._id,
        brand: brand._id,
        stock: 20,
        status: 'new',
        variants: [],
        isFeatured: false,
        slug
      });
      console.log('created', slug);
    }
  }
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
