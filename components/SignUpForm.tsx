"use client";

import { useState } from "react";
import Logo from "./logo";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";


export default function SignUpForm() {

  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);



  const handleSubmit = async (e:any) => {
    e.preventDefault();

    console.log("SENDING DATA:", {
      name,
      email,
      password
    });

    try {

      const response = await axios.post("/api/users", {
        name,
        email,
        password,
      });

      console.log("SUCCESS:", response.data);

      router.push("/dashboard");

    } catch (error:any) {

      console.log(
        "BACKEND ERROR:",
        error.response?.data
      );

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
          className="border p-2 w-full mt-3"
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
        />


        <input
          className="border p-2 w-full mt-3"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />



        <div className="relative mt-3">
          <input
            className="border p-2 pr-10 w-full"
            placeholder="Password"
            type={
              showPassword 
              ? "text" 
              : "password"
            }
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-2"
          >
            {
              showPassword
              ?
              <EyeOff size={20}/>
              :
              <Eye size={20}/>
            }
          </button>
        </div>
        <button 
          className="mt-4 bg-shop-dark-green text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}