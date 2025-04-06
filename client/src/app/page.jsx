
"use client";
import { useState } from "react";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-500">
      <div className="bg-white rounded px-8 py-6 max-w-sm w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>

        {isSignUp ? <SignUp /> : <SignIn />}

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:text-blue-700"
          >
            {isSignUp
              ? "Already have an account? Log in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
