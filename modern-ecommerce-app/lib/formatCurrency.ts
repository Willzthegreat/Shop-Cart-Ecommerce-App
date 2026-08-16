import {
  currencies,
  type CountryCode,
} from "@/config/currency";

export function formatCurrency(
  amount: number,
  country: CountryCode
): string {
  const { currency, locale } = currencies[country];

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}