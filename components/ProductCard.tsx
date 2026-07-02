import Image from "next/image";

interface ProductProps {
  name: string;
  description: string;
  price: number;
  category: string;
  image: any[];
}

export default function ProductCard({
  name,
  price,
  category,
  image,
}: ProductProps) {
  return (
    <div className="border rounded-xl p-4 bg-white group overflow-hidden">
      <Image
        src={image[0]}
        alt={name}
        width={250}
        height={250}
        className="h-52 w-full hover:cursor-pointer object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <p className="text-sm text-gray-400 mt-3">{category}</p>
      <h2 className="font-semibold truncate">{name}</h2>
      <p className="font-bold mt-2">${price}</p>
      <button
        className="
        mt-4
        bg-[#064e3b]
        text-white
        px-5
        py-2
        rounded-lg
        w-full
        "
      >
        Add to Cart
      </button>
    </div>
  );
}
