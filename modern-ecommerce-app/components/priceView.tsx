import PriceFormatter from "./priceFormatter";

interface Props {
  price: number | undefined;
  /** Compare-at/original price saved in the discount field. */
  discount?: number;
  className?: string;
}

const PriceView = ({ price, discount = 0, className = "" }: Props) => {
  if (price === undefined || !Number.isFinite(Number(price))) return null;

  const currentPrice = Number(price);
  const originalPrice = Number(discount) || 0;
  const hasDiscount = originalPrice > currentPrice;

  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <PriceFormatter
        amount={currentPrice}
        className={className || "text-shop-dark-green text-lg font-semibold"}
      />

      {hasDiscount && (
        <del className="flex items-center gap-1 text-sm font-medium text-gray-500 decoration-2">
          <PriceFormatter
            amount={originalPrice}
            className="text-sm font-medium text-gray-500"
          />
        </del>
      )}
    </div>
  );
};

export default PriceView;
