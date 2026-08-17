"use client";

import { cn } from "@/lib/utils/utils";
import { useCurrency } from "@/hooks/useCurrency";

 
 interface Props {
    amount: number | undefined;
    className?: string;
 }

 const PriceFormatter = ({ amount, className }: Props) => {
    const { currency, locale, rateFromUsd, loading } = useCurrency();

    if (amount === undefined || !Number.isFinite(Number(amount)) || loading) {
        return null;
    }

    const formattedPrice = new Intl.NumberFormat(locale, {
        currency,
        style: "currency",
        minimumFractionDigits: 2,
    }).format(Number(amount) * rateFromUsd);

    return (
        <span className={cn("text-sm font-semibold text-dark-color", className)}>
            {formattedPrice}
        </span>
    )
 } 



 export default PriceFormatter;
