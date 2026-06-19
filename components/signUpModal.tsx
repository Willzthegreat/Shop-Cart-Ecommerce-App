"use client";

import { useState } from "react";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";

interface Props {
  open: boolean;
  close: () => void;
}

export default function SignUpModal({ open, close }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="relative w-full max-w-[50%] h-[60%] rounded-lg bg-white p-6">

        {/* Close button */}
        <button
          onClick={close}
          className="absolute right-3 top-3 text-xl"
        >
          ✕
        </button>


        {/* Toggle Buttons */}
        <div className="mb-6 flex justify-center gap-4">

          <button
            onClick={() => setMode("signin")}
            className={`px-4 py-1 rounded ${
              mode === "signin"
                ? "bg-shop-dark-green text-white"
                : "bg-shop-light-green"
            }`}
          >
            Sign In
          </button>


          <button
            onClick={() => setMode("signup")}
            className={`px-4 py-1 rounded ${
              mode === "signup"
                ? "bg-shop-dark-green text-white"
                : "bg-shop-light-green"
            }`}
          >
            Sign Up
          </button>

        </div>


        {/* Display Form */}
        {mode === "signin" ? (
          <SignInForm />
        ) : (
          <SignUpForm />
        )}

      </div>

    </div>
  );
}