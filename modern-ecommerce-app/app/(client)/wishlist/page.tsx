'use client';

import ProductCard from '@/components/ProductCard';
import Container from '@/components/container';
import useStore from '@/store';

export default function WishlistPage() {
  const favoriteProduct = useStore((state) => state.favoriteProduct);

  return (
    <Container className="py-10">
      <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>

      {favoriteProduct.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {favoriteProduct.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
}
