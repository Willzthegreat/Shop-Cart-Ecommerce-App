import Link from "next/link";

export const metadata = {
  title: "About Us",
  description: "Learn more about our modern ecommerce store.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold text-shop-dark-green">About Us</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
        We make it easy to discover quality gadgets, appliances, and everyday
        essentials from trusted brands.
      </p>
      <Link href="/shop" className="mt-8 inline-block rounded bg-shop-dark-green px-5 py-3 font-semibold text-white">
        Browse products
      </Link>
    </main>
  );
}
