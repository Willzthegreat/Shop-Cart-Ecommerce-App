"use client";

import { useState } from "react";
import SignUpModal from "./signUpModal";

const SignUpButton = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowSignup(true)}
        className="text-sm font-semibold"
      >
        SignUp
      </button>

      <SignUpModal
        open={showSignup}
        close={() => setShowSignup(false)}
      />
    </>
  );
};

export default SignUpButton;