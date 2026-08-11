"use client";

interface Props {
  className?: string;
  label?: string;
  initialMode?: "signin" | "signup";
}

import { useState } from "react";
import SignUpModal from "./signUpModal";


const SignUpButton = ({
  className = "",
  label = "Sign In",
  initialMode = "signin",
}: Props) => {

  const [showSignup, setShowSignup] = useState(false);


  return (
    <>

      <button
        type="button"
        onClick={() => setShowSignup(true)}
        className={`${className} text-sm font-semibold whitespace-nowrap`}
      >
        {label}
      </button>


      <SignUpModal
        open={showSignup}
        close={() => setShowSignup(false)}
        initialMode={initialMode}
      />

    </>
  );
};


export default SignUpButton;
