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

const DashboardSidebar = () => {
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
    <aside className="border-b border-gray-200 bg-white md:border-b-0 md:border-r">
      <div className="sticky top-0 p-4 md:p-6">
        <div className="mt-3 flex  items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-shop-dark-green shadow-lg">
            <Image
              src={UserProfilePic}
              className="h-full w-full object-cover"
              alt="User profile"
            />
          </div>
          <div className="w-33 ">
            <h2 className="truncate text-md font-bold text-gray-900">
              {user?.name || "Customer"}
            </h2>
            <p className="truncate text-sm text-gray-500">
              {user?.email || "Admin account"}
            </p>
          </div>
        </div>

        <nav className="mt-6 space-y-1" aria-label="Dashboard sections">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`w-full rounded-md px-4 py-3 text-left font-semibold transition-colors ${
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
