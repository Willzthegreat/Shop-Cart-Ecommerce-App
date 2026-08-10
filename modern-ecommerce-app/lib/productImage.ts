export const PRODUCT_PLACEHOLDER = "/products/product-placeholder.svg";

/** Resolves known legacy paths while preserving valid remote/data URLs. */
export function resolveProductImage(source?: string | null) {
  if (!source) return PRODUCT_PLACEHOLDER;

  if (source.endsWith("/product-placeholder.png")) {
    return PRODUCT_PLACEHOLDER;
  }

  // This legacy filename is still present in some persisted/database records.
  if (source.endsWith("/iphone15-promax.jpg")) {
    return "/products/iphone-17-pro1.jpg";
  }

  // The first Haier image was removed; use an existing image from the same product.
  if (source.endsWith("/haier-s80_1.jpg")) {
    return "/products/haier-s80_2.jpg";
  }

  return source;
}
