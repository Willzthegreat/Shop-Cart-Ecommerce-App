"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import Logo from "./logo";


interface Props {
  open:boolean;
  close:()=>void;
  initialMode?: "signin" | "signup";
}


export default function SignUpModal({
  open,
  close,
  initialMode = "signin",
}:Props){


  const [mode,setMode] = useState<
  "signin" | "signup"
  >(initialMode);

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);



  if(!open) return null;



  return createPortal(
    (
    <div className="
    fixed inset-0 z-9999 flex min-h-screen w-screen items-center justify-center overflow-y-auto
    p-4
    bg-black/70
    ">
      <div className="
      relative
      w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto
      rounded-lg
      bg-white
      p-6
      ">
        <button
        onClick={close}
        className="
        absolute
        right-3
        top-3
        text-xl
        "
        >
          ✕
        </button>
        <div className="mb-6 flex flex-wrap justify-center gap-2 pr-8 sm:gap-4">
          <button
          onClick={()=>setMode("signin")}
          className="
          px-4 py-2
          bg-gray-200
          rounded
          "
          >
            Sign In
          </button>
          <button
          onClick={()=>setMode("signup")}
          className="
          px-4 py-2
          bg-green-600
          text-white
          rounded
          "
          >
            Sign Up
          </button>
        </div>
        {
          mode === "signup"
          ?
          <SignUpForm className={"px-4 py-2 rounded mt-4"} close={close}/>
          :
          <SignInForm
            text={
              <>
              <p>Welcome Back To </p>
               <Logo className="px-2 text-md" />
              </>
            }
            className={"w-full"}
           close={close}/>
        }
      </div>
    </div>
    ),
    document.body,
  );
}
