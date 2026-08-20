"use client";

import { useCurrency } from "@/hooks/useCurrency";

interface PriceViewProps {
  amount: number;
  className: string;
  symbolOnly?: boolean;
}

export default function PriceView({
  amount, 
  className, 
  symbolOnly = false,
}: PriceViewProps) {
  const {
    currency,
    locale,
    loading,
  } = useCurrency();

  if (loading) {
    return <span>Loading...</span>;
  }

  if (symbolOnly) {
    const currencySymbol = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value;

    return <span className={className}>{currencySymbol || currency}</span>;
  }

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  return <span className={className} >{formattedPrice}</span>;
}
