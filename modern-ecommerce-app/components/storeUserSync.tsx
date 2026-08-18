"use client";

import { useEffect } from "react";
import useStore, { GUEST_USER_KEY } from "@/store";

const getUserKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null") as {
      id?: string;
      email?: string;
    } | null;
    return user?.id || user?.email || GUEST_USER_KEY;
  } catch {
    return GUEST_USER_KEY;
  }
};

export default function StoreUserSync() {
  const switchUser = useStore((state) => state.switchUser);

  useEffect(() => {
    const syncUser = () => switchUser(getUserKey());
    syncUser();
    window.addEventListener("userChanged", syncUser);
    return () => window.removeEventListener("userChanged", syncUser);
  }, [switchUser]);

  return null;
}
