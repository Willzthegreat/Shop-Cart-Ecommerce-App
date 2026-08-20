"use client";

import { useState } from "react";
import Logo from "./logo";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  close: () => void;
  className: string;
}

export default function SignUpForm({ close, className }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    console.log("SENDING DATA:", {
      name,
      email,
      password,
    });

    try {
      const response = await axios.post("/api/users", {
        name,
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update Navbar Avatar
      window.dispatchEvent(new Event("userChanged"));

      // Close modal

      close();

      const role = response.data.user?.role || "buyer";
      router.replace(role === "seller" || role === "admin" ? "/dashboard" : "/buyer/dashboard");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Unable to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold flex mb-6">
        Create Account With
        <Logo className="px-2 text-md" />
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          className="
        border
        p-2
        w-full
        mt-3
        "
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="
        border
        p-2
        w-full
        mt-3
        "
          placeholder="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mt-3">
          <input
            className="
          border
          p-2
          pr-10
          w-full
          "
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
          absolute
          right-3
          top-2
          "
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
          className="mt-4 w-full rounded bg-shop-dark-green px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60" >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
