"use client";

import { useEffect, useState } from "react";
import {
  currencies,
  type CountryCode,
} from "@/config/currency";

interface CurrencyState {
  country: CountryCode;
  currency: string;
  locale: string;
  loading: boolean;
}

export function useCurrency(): CurrencyState {
  const [country, setCountry] = useState<CountryCode>("NG");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectCountry() {
      try {
        const response = await fetch("https://ipapi.co/json/");

        if (!response.ok) {
          throw new Error("Unable to detect location");
        }

        const data = await response.json();

        const detectedCountry = data.country_code as CountryCode;

        if (detectedCountry in currencies) {
          setCountry(detectedCountry);
        }
      } catch (error) {
        console.error("Currency detection failed:", error);

        // Default to Nigeria
        setCountry("NG");
      } finally {
        setLoading(false);
      }
    }

    detectCountry();
  }, []);

  return {
    country,
    currency: currencies[country].currency,
    locale: currencies[country].locale,
    loading,
  };
}