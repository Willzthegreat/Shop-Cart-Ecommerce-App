"use client";

import { useState } from "react";
// import Logo from "./logo";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  close: () => void;
  text: any;
  className: string;
}

export default function SignInForm({ close, text, className }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("userChanged"));

      close();
      router.replace("/dashboard");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {text && <h2 className="mb-6 flex flex-wrap items-center gap-1 text-xl font-bold">{text}</h2>}

      <form onSubmit={handleSubmit}>
        <input
          className={`mt-3 min-w-0 rounded border p-2 ${className}`}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mt-3">
          <input
            className={`w-full rounded border p-2 pr-10 ${className}`}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2"
            >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errorMessage && (
          <p role="alert" className="mt-3 text-sm text-red-600">
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
