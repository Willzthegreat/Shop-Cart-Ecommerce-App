"use client";

import { useState } from "react";
import Logo from "./logo";
import axios from "axios";


export default function SignUpForm() {

  const [ name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ password, setPassword] = useState("");


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users", {
        name,
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Unable to create this account", error);
    }
  }

  return (
    <div className="">
      <h2 className="text-xl font-bold flex mb-6">
        Create Account With <Logo className="px-2 text-md" />
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 w-full mt-3"
          placeholder="Name"        
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full mt-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mt-3"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="mt-4 bg-shop-dark-green text-white px-4 py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}