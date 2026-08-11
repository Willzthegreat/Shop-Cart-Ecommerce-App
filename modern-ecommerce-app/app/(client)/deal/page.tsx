import React from "react";
import { getDealProducts } from "@/queries";
import Title from "@/components/title";
import Container from "@/components/container";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const DealPage = async () => {
  const products = await getDealProducts({
    quantity: 10,
  });

  return (
    <div className="bg-deal-bg px-6 py-10 md:px-8 lg:px-30">
      <Container>
        <Title className="mb-15 text-base font-bold uppercase tracking-wide underline decoration-1 underline-offset-4">
          Hot Deals of the Week
        </Title>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            //@ts.ignore
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default DealPage;
