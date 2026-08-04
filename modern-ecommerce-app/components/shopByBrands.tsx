import Image from "next/image";
import Link from "next/link";
import Title from "./title";
import {
  GitCompareArrows,
  Headset,
  ShieldCheck,
  Truck,
} from "lucide-react";

const extraData = [
  {
    title: "Free Delivery",
    description: "Free Shipping over $100",
    icon: <Truck size={45} />,
  },
  {
    title: "Free Return",
    description: "Free Returns on eligible items",
    icon: <GitCompareArrows size={45} />,
  },
  {
    title: "Customer Support",
    description: "Friendly 24/7 customer support",
    icon: <Headset size={45} />,
  },
  {
    title: "Money Back Guarantee",
    description: "Quality checked by our team",
    icon: <ShieldCheck size={45} />,
  },
];

type Brand = {
  _id: string;
  title: string;
  slug: string;
  logo?: string;
};

interface ShopByBrandsProps {
  brands?: Brand[];
}

const ShopByBrands = ({ brands = [] }: ShopByBrandsProps) => {
  return (
    <section className="my-10 bg-gray-50 rounded-xl border border-shop-light-green/20  p-5 shadow-sm md:my-20 lg:p-7">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <Title>Shop By Brands</Title>

        <Link
          href="/shop/brands"
          className="text-sm font-semibold tracking-wide transition hover:text-shop-btn-dark-green"
        >
          View All
        </Link>
      </div>

      {/* Brands - Single Horizontal Row */}
      <div className="mt-6 flex gap-5 overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {brands?.map((brand) => (
          <Link
            key={brand._id}
            href={`/shop?brand=${brand.slug}`}
            aria-label={`Shop ${brand.title} products`}
            className="
              group
              flex
              h-28
              w-46
              shrink-0
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              bg-white
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-shop-btn-dark-green
              hover:shadow-lg
            "
          >
            {brand.logo ? (
              <Image
                src={brand.logo}
                alt={brand.title}
                width={140}
                height={70}
                unoptimized
                className="
                  h-14
                  w-auto
                  object-contain
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />
            ) : (
              <div className="flex h-14 w-full items-center justify-center rounded bg-gray-100 text-[8px] font-medium text-gray-500">
                {brand.title}
              </div>
            )}

            <p className="mt-4 text-center text-sm font-semibold text-gray-700">
              {brand.title}
            </p>
          </Link>
        ))}
      </div>

      {/* Extra Services */}
      <div className="mt-16 grid grid-cols-1 gap-4 border-y border-shop-light-green/20 py-5 hover:not-only:shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {extraData.map((item, index) => (
          <div
            key={index}
            className="
              group
              flex
              items-center
              gap-3
              text-light-Color
              transition-colors cursor-pointer
              duration-300 hover:text-shop-light-green px-4
            "
          >
            {/* Icon */}
            <span
              className="
                inline-flex shrink-0 scale-100 transition-transform duration-300 px-4 group-hover:scale-90
              "
            >
              {item.icon}
            </span>

            {/* Text */}
            <div className="text-sm">
              <p className="font-bold capitalize text-dark-color/80">
                {item.title}
              </p>

              <p className="text-light-Color">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByBrands;