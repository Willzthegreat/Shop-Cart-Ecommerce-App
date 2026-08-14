"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NoAccess from "@/components/noAccess";
import image from "@/public/banner1.png";

interface StoredUser {
  name?: string;
  email?: string;
  phone?: string;
  lastName?: string;
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
  const [activeSection, setActiveSection] =
    useState<ProfileSection>("Personal Information");

  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    lastName: "",
  });

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setUser(null);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser) as StoredUser;

        setUser(parsedUser);

        setEditForm({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          lastName: parsedUser.lastName || "",
        });
      } catch {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditProfile = () => {
    if (!user) return;

    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      lastName: user.lastName || "",
    });

    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!user) return;

    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      lastName: user.lastName || "",
    });

    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    if (!user) return;

    const updatedUser: StoredUser = {
      ...user,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      lastName: editForm.lastName,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setUser(updatedUser);
    setIsEditing(false);

    window.dispatchEvent(new Event("userChanged"));
  };

  if (!user) {
    return <NoAccess details="Sign in to view your profile." />;
  }

  return (
    <main>
      <div className="grid min-h-175 grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="border-r bg-gray-100">
          <div className="p-6">
            <h1 className="text-2xl font-bold">My Profile</h1>

            <div className="mt-6">
              <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-shop-dark-green shadow-md">
                <Image
                  className="h-full w-full object-cover"
                  src={image}
                  alt="Profile"
                />
              </div>

              <div className="text-xs">
                <div className="flex gap-2">
                  <p className="text-gray-500">Name:</p>
                  <p className="font-semibold">
                    {user.name || "Customer"}
                  </p>
                </div>

                <div className="mt-2 flex gap-2">
                  <p className="text-gray-500">Email:</p>
                  <p className="break-all font-semibold">
                    {user.email || "No email available"}
                  </p>
                </div>
              </div>
            </div>

            <nav
              className="mt-10 space-y-1 font-semibold"
              aria-label="Profile sections"
            >
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
              <h2 className="text-2xl font-bold">
                {activeSection}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your {activeSection.toLowerCase()}.
              </p>
            </div>

            {activeSection === "Personal Information" && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="rounded-md bg-shop-btn-dark-green px-5 py-2 text-sm font-semibold text-white"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditProfile}
                    className="rounded-md bg-shop-btn-dark-green px-5 py-2 text-sm font-semibold text-white"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {activeSection === "Personal Information" ? (
            <>
              <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold">
                    Personal Details
                  </h3>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">
                        First Name
                      </p>

                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-shop-btn-dark-green"
                          placeholder="First name"
                        />
                      ) : (
                        <p className="mt-1 font-semibold">
                          {user.name || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Last Name
                      </p>

                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={editForm.lastName}
                          onChange={handleInputChange}
                          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-shop-btn-dark-green"
                          placeholder="Last name"
                        />
                      ) : (
                        <p className="mt-1 font-semibold">
                          {user.lastName || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Email Address
                      </p>

                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-shop-btn-dark-green"
                          placeholder="Email address"
                        />
                      ) : (
                        <p className="mt-1 break-all font-semibold">
                          {user.email || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Phone Number
                      </p>

                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-shop-btn-dark-green"
                          placeholder="Phone number"
                        />
                      ) : (
                        <p className="mt-1 font-semibold">
                          {user.phone || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold">
                    Account Status
                  </h3>

                  <p className="mt-6 text-sm text-gray-500">
                    Account
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    Active
                  </p>

                  <p className="mt-5 text-sm text-gray-500">
                    Email Verification
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    Verified
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">
                  Recent Orders
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  View your latest purchases.
                </p>

                <div className="mt-8 py-10 text-center text-sm text-gray-500">
                  You have no orders yet.
                </div>
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-lg border bg-white p-8 text-gray-500 shadow-sm">
              The {activeSection.toLowerCase()} section is ready to
              be configured.
            </div>
          )}
        </section>
      </div>

      <div className="p-6">
        <Link
          href="/shop/cart"
          className="font-semibold text-shop-dark-green hover:underline"
        >
          ← Back to Cart
        </Link>
      </div>
    </main>
  );
}