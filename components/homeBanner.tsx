import Link from "next/link"
import { Title } from "./ui/text"
import Image from "next/image"
import Banner1 from "@/public/banner1..png"
import ProductGrid from "./productGrid";
import { productType } from "@/constants/data";


const HomeBanner = () => {
  
  return (
    <>
      <main className="px-6 md:px-8 lg:px-30">
      {/* Hero Section */}

      <section className="py-16 md:py-0 bg-shop-light-pink rounded-lg px-10 lg:px-24 flex items-center justify-between">
        <div className="space-y-5">
          <Title > Grab Upto 50% off on <br/>
            Selected Headphone
          </Title>
          <Link href={"/shop"} className="bg-shop-dark-green/90 text-white/90 px-5 py-2 rounded-md text-sm font-semibold hover:text-white hover:bg-shop-dark-green hoverEffect">
            Buy Now
          </Link>
        </div>
        <div>
          <Image src={Banner1} alt="banner 1" priority className="hidden  md:inline-flex w-70 " />
        </div>
      </section>

      {/* Categories */}

      <section className="mt-10">
        <ProductGrid />
      </section>
    </main>
    </>
  );
};



export default HomeBanner