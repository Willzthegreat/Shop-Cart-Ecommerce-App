"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NoAccess from "@/components/noAccess";
import image from "@/public/banner1.png";

interface StoredUser {
  name?: string;
  email?: string;
}

const sections = [
  "Personal Information",
  "Account & Security",
  "Address Book",
  "Orders",
  "Wishlist",
  "Payment Methods",
  "Reviews & Ratings",
  "Notifications & Preferences",
  "Coupons & Rewards",
] as const;

type ProfileSection = (typeof sections)[number];

export default function ProfilePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [activeSection, setActiveSection] = useState<ProfileSection>(
    "Personal Information",
  );

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");
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

  if (!user) {
    return <NoAccess details="Sign in to view your profile." />;
  }

  return (
    <main className="">
      <div className="grid min-h-[700px] grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="border-r bg-gray-100">
          <div className="p-6">
            <h1 className="text-2xl font-bold">My Profile</h1>

            <div className="mt-6">
              <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-shop-dark-green shadow-md">
                <Image className="h-full w-full object-cover" src={image} alt="Profile" />
              </div>
              <div className="text-xs">
                <div className="flex gap-2">
                  <p className="text-gray-500">Name:</p>
                  <p className="font-semibold">{user.name || "Customer"}</p>
                </div>
                <div className="mt-2 flex gap-2">
                  <p className="text-gray-500">Email:</p>
                  <p className="break-all font-semibold">{user.email || "No email available"}</p>
                </div>
              </div>
            </div>

            <nav className="mt-10 space-y-1 font-semibold" aria-label="Profile sections">
              {sections.map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => setActiveSection(section)}
                  className={`w-full rounded-md px-4 py-3 text-left transition ${
                    activeSection === section
                      ? "bg-shop-btn-dark-green text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {section}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <section className="p-4 sm:p-8" aria-live="polite">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{activeSection}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your {activeSection.toLowerCase()}.
              </p>
            </div>
            {activeSection === "Personal Information" && (
              <button type="button" className="rounded-md bg-shop-btn-dark-green px-5 py-2 text-sm font-semibold text-white">
                Edit Profile
              </button>
            )}
          </div>

          {activeSection === "Personal Information" ? (
            <>
              <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold">Personal Details</h3>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="mt-1 font-semibold">{user.name || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="mt-1 font-semibold">Not provided</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="mt-1 break-all font-semibold">{user.email || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="mt-1 font-semibold">Not provided</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold">Account Status</h3>
                  <p className="mt-6 text-sm text-gray-500">Account</p>
                  <p className="mt-1 font-semibold text-green-600">Active</p>
                  <p className="mt-5 text-sm text-gray-500">Email Verification</p>
                  <p className="mt-1 font-semibold text-green-600">Verified</p>
                </div>
              </div>

              <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">Recent Orders</h3>
                <p className="mt-1 text-sm text-gray-500">View your latest purchases.</p>
                <div className="mt-8 py-10 text-center text-sm text-gray-500">You have no orders yet.</div>
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-lg border bg-white p-8 text-gray-500 shadow-sm">
              The {activeSection.toLowerCase()} section is ready to be configured.
            </div>
          )}
        </section>
      </div>

      <div className="p-6">
        <Link href="/shop/cart" className="font-semibold text-shop-dark-green hover:underline">
          ← Back to Cart
        </Link>
      </div>
    </main>
  );
}
