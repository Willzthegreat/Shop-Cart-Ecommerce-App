"use client";

import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  close: () => void;
  text: React.ReactNode;
  className: string;
}

export default function SignInForm({
  close,
  text,
  className,
}: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
        accountType,
      });

      const user = response.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("userChanged"));

      close();

      const role = user?.role?.toLowerCase();

      if (role === "seller") {
        router.replace("/dashboard");
      } else if (role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/buyer/dashboard");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {text && (
        <h2 className="mb-6 flex flex-wrap items-center gap-1 text-xl font-bold">
          {text}
        </h2>
      )}

      <p className="mb-2 text-[8px]">
        Login to your
        <button
          type="button"
          onClick={() => setAccountType("buyer")}
          className={`pl-1 ${accountType === "buyer" ? "font-semibold text-shop-dark-green" : "text-shop-light-green"}`}
        >
          Buyer&apos;s Account
        </button>

        <span className="px-1">or</span>

        <button
          type="button"
          onClick={() => setAccountType("seller")}
          className={accountType === "seller" ? "font-semibold text-shop-dark-green" : "text-shop-light-green"}
        >
          Seller&apos;s Account
        </button>
      </p>

      <form onSubmit={handleSubmit}>
        <input
          className={`mt-3 w-full min-w-0 rounded border p-2 ${className}`}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <div className="relative mt-3">
          <input
            className={`w-full rounded border p-2 pr-10 ${className}`}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2"
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mt-3 text-sm text-red-600"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded bg-shop-dark-green px-4 py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
