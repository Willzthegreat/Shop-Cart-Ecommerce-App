"use client";

import Logo from "./logo";

export default function SignInForm() {
  return (
    <div>
      <h2 className="text-xl font-bold flex mb-6">
        Welcome Back To <Logo className="px-2 text-md" />
      </h2>

      <input
        className="border p-2 w-full mt-3"
        placeholder="Email"
      />

      <input
        className="border p-2 w-full mt-3"
        placeholder="Password"
        type="password"
      />

      <button className="mt-4 bg-shop-dark-green text-white px-4 py-2 rounded">
        Sign In
      </button>
    </div>
  );
}