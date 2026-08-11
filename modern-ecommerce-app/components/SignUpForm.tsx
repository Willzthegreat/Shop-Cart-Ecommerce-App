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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

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

      console.log("SIGNUP SUCCESS:", response.data);

      // Save new user immediately
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update Navbar Avatar
      window.dispatchEvent(new Event("userChanged"));

      // Close modal

      close();

      // Redirect dashboard

      router.replace("/dashboard");
    } catch (error: any) {
      console.log("SIGNUP ERROR:", error.response?.data || error.message);
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
