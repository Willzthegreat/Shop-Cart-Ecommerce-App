"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

interface ProductResult {
  _id: string;
  name: string;
  slug: string;
  code?: string;
}

interface SearchLink {
  label: string;
  href: string;
  keywords: string;
  group: "Pages" | "Account";
}

const searchLinks: SearchLink[] = [
  { label: "Home", href: "/", keywords: "home", group: "Pages" },
  { label: "Shop", href: "/shop", keywords: "shop products store", group: "Pages" },
  { label: "Deals", href: "/deal", keywords: "deal sale hot offers", group: "Pages" },
  { label: "Categories", href: "/shop/categories", keywords: "category categories", group: "Pages" },
  { label: "Brands", href: "/shop/brands", keywords: "brand brands", group: "Pages" },
  { label: "Blog", href: "/blog", keywords: "blog articles", group: "Pages" },
  { label: "About", href: "/about", keywords: "about company", group: "Pages" },
  { label: "Contact", href: "/contact", keywords: "contact support", group: "Pages" },
  { label: "FAQs", href: "/faqs", keywords: "faq questions", group: "Pages" },
  { label: "Help", href: "/help", keywords: "help support", group: "Pages" },
  { label: "Cart", href: "/shop/cart", keywords: "cart basket", group: "Account" },
  { label: "Profile", href: "/shop/profile", keywords: "profile account", group: "Account" },
  { label: "Wishlist", href: "/wishlist", keywords: "wishlist favorite favorites", group: "Account" },
  { label: "Orders", href: "/shop/orders", keywords: "orders purchases", group: "Account" },
  { label: "Address Book", href: "/addresses", keywords: "address addresses delivery", group: "Account" },
];

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const matchingLinks = normalizedQuery
    ? searchLinks.filter((item) =>
        `${item.label} ${item.keywords}`.toLowerCase().includes(normalizedQuery),
      )
    : [];

  useEffect(() => {
    if (!open || !normalizedQuery) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Search failed");
        const result = await response.json();
        setProducts((result.data || []).slice(0, 8));
      } catch (error) {
        if (!controller.signal.aborted) setProducts([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, normalizedQuery, query]);

  useEffect(() => {
    const closeSearch = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeSearch);
    return () => document.removeEventListener("mousedown", closeSearch);
  }, []);

  return (
    <div ref={searchRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full p-2 hover:text-shop-light-green sm:p-1"
      >
        {open ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed left-3 right-3 top-20 z-50 rounded-lg border bg-white p-3 shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-10 sm:w-96">
          <div className="flex items-center gap-2 rounded-md border px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, pages, accounts..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mt-3 max-h-[65vh] overflow-y-auto sm:max-h-96">
            {loading && <p className="px-2 py-3 text-sm text-gray-500">Searching...</p>}

            {!loading && normalizedQuery && products.length > 0 && (
              <section>
                <p className="px-2 pb-1 text-xs font-semibold uppercase text-gray-400">Products</p>
                {products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    onClick={() => setOpen(false)}
                    className="block rounded px-2 py-2 text-sm hover:bg-gray-100"
                  >
                    <span className="font-medium">{product.name}</span>
                    {product.code && <span className="ml-2 text-xs text-gray-400">{product.code}</span>}
                  </Link>
                ))}
              </section>
            )}

            {normalizedQuery && matchingLinks.length > 0 && (
              <section className={products.length > 0 ? "mt-3" : ""}>
                <p className="px-2 pb-1 text-xs font-semibold uppercase text-gray-400">
                  Pages and accounts
                </p>
                {matchingLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded px-2 py-2 text-sm hover:bg-gray-100"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-gray-400">{item.group}</span>
                  </Link>
                ))}
              </section>
            )}

            {!loading && normalizedQuery && products.length === 0 && matchingLinks.length === 0 && (
              <p className="px-2 py-4 text-center text-sm text-gray-500">No results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
