"use client";

import { useState } from "react";
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { AiOutlineLoading as LoadingIcon } from "react-icons/ai";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      throw new Error("Couldn't log in!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            logo
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <button
            disabled={isLoading}
            onClick={loginWithGoogle}
            className="flex items-center gap-2 text-lg border px-4 py-1 rounded hover:text-60 hover:bg-30 transition-colors duration-700"
          >
            <div className="w-6 h-6 flex justify-center items-center">
              {isLoading ? (
                <LoadingIcon className="animate-spin" />
              ) : (
                <GoogleIcon className="text-2xl" />
              )}
            </div>
            Google
          </button>
        </div>
      </div>
    </>
  );
}
