"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";
import SignUpButton from "./SignUpButton";

export default function UserAvatar() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [open, setOpen] = useState(false);

  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("userChanged", loadUser);
    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    setOpen(false);
    router.replace("/");
  };

  if (!user) {
    return <SignUpButton />;
  }

  return (
    <div className="relative ml-10">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 ">
        <div className=" w-8 h-8 rounded-full bg-shop-dark-green text-white flex items-center justify-center font-bold ">
          {user.name ? (
            user.name.charAt(0).toUpperCase()
          ) : (
            <UserCircle size={30} />
          )}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-lg p-4 z-50 " >
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <hr className="my-3" />
          <button 
          onClick={() => router.replace("/dashboard")}
          // onClick={() => router.push("/dashboard")}
          className=" w-full text-left py-2 hover:bg-gray-100 ">
            Dashboard
          </button>
          <button onClick={() => router.replace("/profile")} className="w-full text-left py-2 hover:bg-gray-100 ">
            Profile
          </button>
          <button
            onClick={logout}
            className="w-full text-left py-2 text-red-600 hover:bg-gray-100 ">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
