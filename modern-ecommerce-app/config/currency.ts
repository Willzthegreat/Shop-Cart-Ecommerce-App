export const currencies = {
  NG: {
    currency: "NGN",
    locale: "en-NG",
  },
  US: {
    currency: "USD",
    locale: "en-US",
  },
  GB: {
    currency: "GBP",
    locale: "en-GB",
  },
  GH: {
    currency: "GHS",
    locale: "en-GH",
  },
  EU: {
    currency: "EUR",
    locale: "en-IE",
  },
} as const;

export type CountryCode = keyof typeof currencies;