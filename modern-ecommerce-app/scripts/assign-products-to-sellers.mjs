import fs from "node:fs";
import mongoose from "mongoose";

function loadLocalEnv() {
  const envPath = ".env.local";
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

loadLocalEnv();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGODB_URL;
if (!mongoUri) throw new Error("Missing MongoDB connection string.");

await mongoose.connect(mongoUri);
const db = mongoose.connection;
const users = db.collection("users");
const products = db.collection("products");

const sellers = await users
  .find({ email: { $in: ["theyknow@yahoo.com", "theyknow123@yahoo.com"] } })
  .project({ name: 1, email: 1 })
  .toArray();

const willz = sellers.find((seller) => seller.email === "theyknow@yahoo.com");
const mandy = sellers.find((seller) => seller.email === "theyknow123@yahoo.com");

if (!willz || !mandy) {
  throw new Error("Could not find both seller accounts by their email addresses.");
}

const allProducts = await products.find({}).sort({ createdAt: 1, _id: 1 }).toArray();
const assignments = allProducts.map((product, index) => ({
  id: product._id,
  ownerId: (index % 2 === 0 ? willz : mandy)._id.toString(),
}));

console.log(`Found ${allProducts.length} products.`);
console.log(`${willz.name} (${willz.email}): ${assignments.filter((item) => item.ownerId === willz._id.toString()).length}`);
console.log(`${mandy.name} (${mandy.email}): ${assignments.filter((item) => item.ownerId === mandy._id.toString()).length}`);

if (process.argv.includes("--apply")) {
  if (assignments.length > 0) {
    await products.bulkWrite(
      assignments.map((assignment) => ({
        updateOne: {
          filter: { _id: assignment.id },
          update: { $set: { ownerId: assignment.ownerId } },
        },
      })),
    );
  }
  console.log("Product ownership assignments applied.");
  console.log(`${willz.name} stored products: ${await products.countDocuments({ ownerId: willz._id.toString() })}`);
  console.log(`${mandy.name} stored products: ${await products.countDocuments({ ownerId: mandy._id.toString() })}`);
} else {
  console.log("Dry run only. Re-run with --apply to save assignments.");
}

await mongoose.disconnect();
