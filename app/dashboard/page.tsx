import React from "react";
import Image from "next/image";
import HeroImage from "@/public/HeroSecImage.png";
import Title from "@/components/ui/text";
import HomeBanner from "@/components/homeBanner";

const Page = () => {
  return (
    <>
      <section>
        <div>
          <HomeBanner />
          <div></div>
        </div>
      </section>
    </>
  );
};

export default Page;