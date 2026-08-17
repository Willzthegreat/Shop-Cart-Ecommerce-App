export const currencies = {
  NG: {
    currency: "NGN",
    locale: "en-NG",
    // Product prices are stored in USD.
    rateFromUsd: 1600,
  },
  US: {
    currency: "USD",
    locale: "en-US",
    rateFromUsd: 1,
  },
  GB: {
    currency: "GBP",
    locale: "en-GB",
    rateFromUsd: 0.78,
  },
  GH: {
    currency: "GHS",
    locale: "en-GH",
    rateFromUsd: 15,
  },
  EU: {
    currency: "EUR",
    locale: "en-IE",
    rateFromUsd: 0.92,
  },
  CA: { currency: "CAD", locale: "en-CA", rateFromUsd: 1.37 },
  AU: { currency: "AUD", locale: "en-AU", rateFromUsd: 1.53 },
  IN: { currency: "INR", locale: "en-IN", rateFromUsd: 83 },
  ZA: { currency: "ZAR", locale: "en-ZA", rateFromUsd: 18 },
  KE: { currency: "KES", locale: "en-KE", rateFromUsd: 130 },
  JP: { currency: "JPY", locale: "ja-JP", rateFromUsd: 150 },
  CN: { currency: "CNY", locale: "zh-CN", rateFromUsd: 7.2 },
  AE: { currency: "AED", locale: "ar-AE", rateFromUsd: 3.67 },
  BR: { currency: "BRL", locale: "pt-BR", rateFromUsd: 5.2 },
  MX: { currency: "MXN", locale: "es-MX", rateFromUsd: 18 },
} as const;

export type CountryCode = keyof typeof currencies;
