"use client";

import { useEffect, useState } from "react";
import {
  currencies,
  type CountryCode,
} from "@/config/currency";

const euroCountries = new Set([
  "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR",
  "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK",
]);

function countryFromLocale(locale?: string): CountryCode | undefined {
  const country = locale?.split("-")[1]?.toUpperCase();

  if (country && country in currencies) return country as CountryCode;
  if (country && euroCountries.has(country)) return "EU";
  return undefined;
}

function countryFromCode(countryCode: unknown): CountryCode | undefined {
  if (typeof countryCode !== "string") return undefined;

  const country = countryCode.trim().toUpperCase();
  if (country in currencies) return country as CountryCode;
  if (euroCountries.has(country)) return "EU";
  return undefined;
}

function countryFromIpData(data: unknown): CountryCode | undefined {
  if (!data || typeof data !== "object") return undefined;

  const response = data as { country_code?: unknown; currency?: unknown };
  const country = countryFromCode(response.country_code);
  if (country) return country;

  // Use the currency supplied by the IP service when the country is a
  // regional currency we support (for example, EUR across the euro zone).
  if (typeof response.currency === "string") {
    const currency = Object.entries(currencies).find(
      ([, details]) => details.currency === response.currency.toUpperCase()
    );
    if (currency) return currency[0] as CountryCode;
  }

  return undefined;
}

let detectionPromise: Promise<CountryCode> | undefined;

function detectCountryOnce(): Promise<CountryCode> {
  if (detectionPromise) return detectionPromise;

  detectionPromise = (async () => {
    const browserCountry = countryFromLocale(navigator.language);

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);
      let response: Response;

      try {
        response = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
          cache: "no-store",
        });
      } finally {
        window.clearTimeout(timeout);
      }

      if (response.ok) {
        const data: unknown = await response.json();
        const detectedCountry = countryFromIpData(data);

        if (detectedCountry) {
          return detectedCountry;
        }
      }
    } catch (error) {
      console.warn("Currency detection failed; using browser locale:", error);
    }

    return browserCountry || "NG";
  })();

  return detectionPromise;
}

interface CurrencyState {
  country: CountryCode;
  currency: string;
  locale: string;
  rateFromUsd: number;
  loading: boolean;
}

export function useCurrency(): CurrencyState {
  const [country, setCountry] = useState<CountryCode>(
    () => countryFromLocale(typeof navigator === "undefined" ? undefined : navigator.language) || "NG"
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    detectCountryOnce().then((detectedCountry) => {
      if (!mounted) return;
      setCountry(detectedCountry);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    country,
    currency: currencies[country].currency,
    locale: currencies[country].locale,
    rateFromUsd: currencies[country].rateFromUsd,
    loading,
  };
}
