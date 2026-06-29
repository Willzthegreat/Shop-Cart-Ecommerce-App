import Link from "next/link"
import { Title } from "./ui/text"
import Image from "next/image"
import Banner1 from "@/public/banner1..png"


const HomeBanner = () => {
  return (
    <>
      <div className="py-16 md:py-0 mx-5 md:mx-35 bg-shop-light-pink rounded-lg px-10 lg:px-24 flex items-center justify-between">
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
      </div>
    </>
  );
};



export default HomeBanner