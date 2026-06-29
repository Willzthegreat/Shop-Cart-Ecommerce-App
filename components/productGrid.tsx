import ProductCard from "./ProductCard";

interface Props {
  products: any[];
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 ">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          name={product.name}
          description={product.description}
          price={product.price}
          category={product.category}
          image={product.image}
        />
      ))}
    </div>
  );
}
