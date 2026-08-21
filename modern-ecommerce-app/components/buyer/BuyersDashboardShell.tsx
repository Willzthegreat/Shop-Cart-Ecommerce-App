"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BuyersOverView from "./overView";
import BuyersProducts from "./BuyerProducts";
import BuyersProfile from "./buyersProfile";
import BuyersOrderDetails from "./buyersOrderDetails";
import BuyersAddressBook from "./buyersAddressBook";
import PaymentMethods from "../PaymentMethods";
import Notifications from "./Notifications";
import AccountSetting from "./AccountSetting";

type BuyersDashboardView =
  | "Overview"
  | "Products"
  | "Profile"
  | "Order Details"
  | "Address Book"
  | "Payment Methods"
  | "Notifications"
  | "Account Setting";

const buyerViews: BuyersDashboardView[] = [
  "Overview",
  "Products",
  "Profile",
  "Order Details",
  "Address Book",
  "Payment Methods",
  "Notifications",
  "Account Setting",
];

const isBuyerDashboardView = (view: string | null): view is BuyersDashboardView =>
  view !== null && buyerViews.includes(view as BuyersDashboardView);

const BuyersDashboardShell = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewFromUrl = searchParams.get("view");
  const initialView: BuyersDashboardView = isBuyerDashboardView(viewFromUrl)
    ? viewFromUrl
    : "Overview";

  const [activeView, setActiveView] = useState<BuyersDashboardView>(initialView);

  useEffect(() => {
    // The URL is the source of truth when browser navigation changes it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveView(initialView);
  }, [initialView]);

  const changeView = (view: BuyersDashboardView) => {
    setActiveView(view);

    const params = new URLSearchParams(searchParams.toString());
    if (view === "Overview") {
      params.delete("view");
    } else {
      params.set("view", view);
    }

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 py-6 px-2 md:grid-cols-[240px_1fr]">
      <aside className="rounded-lg border bg-white p-4">
        <nav aria-label="Buyer dashboard navigation" className="space-y-1">
          {buyerViews.map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => changeView(view)}
              className={`block w-full rounded px-3 py-2 text-left text-sm ${
                activeView === view
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {view}
            </button>
          ))}
        </nav>
      </aside>

      <main className="rounded-lg border bg-white p-6">
        {activeView  && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">{activeView}</h1>
            <p className="mt-2 text-gray-600">Manage your account from one place.</p>
          </>
        )}


        {activeView === "Overview" && (
          <div className="w-full">
            <BuyersOverView />
          </div>
        )}
        {activeView === "Products" && (
          <div className="w-full">
            <BuyersProducts />
          </div>
        )}
        {activeView === "Profile" && (
          <div className="w-full">
            <BuyersProfile />
          </div>
        )}
        {activeView === "Order Details" && (
          <div className="w-full">
            <BuyersOrderDetails />
          </div>
        )}
        {activeView === "Address Book" && (
          <div className="w-full">
            <BuyersAddressBook />
          </div>
        )}
        {/* {activeView === "Wishlist" && (
          <div className="w-full">
            <WishlistPage className={"lg:max-w-5xl"}/>
          </div>
        )}
        {activeView === "Cart" && (
          <div className="w-full">
            <CartPage />
          </div>
        )} */}
        {activeView === "Payment Methods" && (
          <div className="w-full">
            <PaymentMethods />
          </div>
        )}
        {activeView === "Notifications" && (
          <div className="w-full">
            <Notifications />
          </div>
        )}
        {activeView === "Account Setting" && (
          <div className="w-full">
            <AccountSetting />
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyersDashboardShell;
