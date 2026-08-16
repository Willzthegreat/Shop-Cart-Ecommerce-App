"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import UserProfilePic from "@/public/banner1..png";

type StoredUser = {
  name?: string;
  email?: string;
};


const sections = [
  "Overview",
  "Products",
  "Orders",
  "Customers",
  "Marketing",
  "Content",
  "Analytics",
  "Setting",
] as const;

type DashboardView = "overview" | "products" | "orders" | "marketing" | "customers" | "content" | "analysis";

type DashboardSidebarProps = {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
};

const DashboardSidebar = ({
  activeView,
  onViewChange,
}: DashboardSidebarProps) => {
  const [activeSection, setActiveSection] =
    useState<(typeof sections)[number]>("Overview");
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = window.localStorage.getItem("user");

      if (!savedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(savedUser) as StoredUser);
      } catch {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("userChanged", loadUser);

    return () => window.removeEventListener("userChanged", loadUser);
  }, []);

  return (
    <aside className="border-b border-gray-200 bg-white md:min-h-screen md:border-b-0 md:border-r">
      <div className="p-4 md:sticky md:top-0 md:p-6">
            <h2 className="truncate text-base mb-4 font-bold text-gray-900 sm:text-xl">
             Seller's Dashboard
            </h2>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-shop-dark-green shadow-lg sm:h-16 sm:w-16">
            <Image
              src={UserProfilePic}
              className="h-full w-full object-cover"
              alt="User profile"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold text-gray-900 sm:text-lg">
              {user?.name || "Customer"}
            </h2>
            <p className="truncate text-xs text-gray-500 sm:text-sm">
              {user?.email || "Admin account"}
            </p>
          </div>
        </div>

        <nav
          className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 md:mt-8 md:grid-cols-1 md:gap-1"
          aria-label="Dashboard sections"
        >
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => {
                setActiveSection(section);
                if (section.toLowerCase() !== activeView) {
                const view =
                  section === "Analytics" ? "analysis" : section.toLowerCase();
                  if (
                    view === "overview" ||
                    view === "products" ||
                    view === "orders" ||
                    view === "marketing" ||
                    view === "customers" ||
                    view === "content" ||
                    view === "analysis" 
                  ) {
                    onViewChange(view);
                  }
                }
              }}
              className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors sm:px-4 sm:py-3 sm:text-base ${
                activeSection === section
                  ? "bg-shop-btn-dark-green text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;



